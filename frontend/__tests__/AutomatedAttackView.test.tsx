import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// Fix: Add imports for Jest globals to resolve TypeScript errors about missing type definitions.
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AutomatedAttackView } from '../components/AutomatedAttackView';
import * as apiClient from '../apiClient';

// Mock the apiClient module
jest.mock('../apiClient', () => ({
    postSniper: jest.fn(),
    postSpotter: jest.fn(),
}));

// Fix: Explicitly type the mocks to return Promises to fix issues with
// mockResolvedValue/mockRejectedValue parameter type inference.
// FIX: The generic for `jest.Mock` with one type argument must be a function-like type.
// The original `Promise<...>` type was incorrect and has been replaced with the full function signature.
const mockPostSniper = apiClient.postSniper as jest.Mock<
    (prompt: string, rounds: number, model: string) => Promise<apiClient.SniperApiResponse>
>;
const mockPostSpotter = apiClient.postSpotter as jest.Mock<
    (sessionId: string, modelOutput: string) => Promise<apiClient.SpotterApiResponse>
>;

describe('AutomatedAttackView', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should call backend APIs and display results on single attack launch', async () => {
        // Arrange: Set up mock responses from the backend
        const sniperResponse: apiClient.SniperApiResponse = {
            session_id: 'test-session-123',
            round_responses: [{ round: 1, text: 'This is the target model response.' }],
            summary: { round_count: 1, avg_length: 30 },
        };
        const spotterResponse: apiClient.SpotterApiResponse = {
            score: 8,
            labels: ['success', 'vulnerable'],
            comments: 'The model was successfully jailbroken.',
        };

        mockPostSniper.mockResolvedValue(sniperResponse);
        mockPostSpotter.mockResolvedValue(spotterResponse);

        render(<AutomatedAttackView />);
        
        // Act: Simulate user clicking the "Launch Single Attack" button
        const launchButton = screen.getByText('Launch Single Attack');
        fireEvent.click(launchButton);

        // Assert: Check that the loading state appears and then the results are rendered
        expect(screen.getByText('ATTACKING...')).toBeInTheDocument();

        await waitFor(() => {
            // Check if postSniper was called correctly
            expect(mockPostSniper).toHaveBeenCalledWith(
                expect.any(String), // The default seed prompt
                1, // Number of rounds for a single attack
                'gemini-2.5-flash' // The default model
            );
        });

        await waitFor(() => {
            // Check if postSpotter was called correctly
            expect(mockPostSpotter).toHaveBeenCalledWith(
                'test-session-123',
                'This is the target model response.'
            );
        });

        await waitFor(() => {
            // Check if the spotter feed shows the response text and analysis
            expect(screen.getByText('Target Response')).toBeInTheDocument();
            expect(screen.getByText('This is the target model response.')).toBeInTheDocument();
            expect(screen.getByText(/Score: 8/)).toBeInTheDocument();
            expect(screen.getByText(/Labels: success, vulnerable/)).toBeInTheDocument();
            expect(screen.getByText(/The model was successfully jailbroken./)).toBeInTheDocument();
            expect(screen.getByText('Attack complete. 1 rounds logged and analyzed.')).toBeInTheDocument();
        });

        // Check that the loading state is gone
        expect(screen.getByText('IDLE')).toBeInTheDocument();
    });

    it('should display an error message if the API call fails', async () => {
        // Arrange: Mock a failed API call
        const errorMessage = 'API Error: 500 Internal Server Error';
        mockPostSniper.mockRejectedValue(new Error(errorMessage));

        render(<AutomatedAttackView />);

        // Act: Click the launch button
        fireEvent.click(screen.getByText('Launch Single Attack'));

        // Assert: Check for the error message
        await waitFor(() => {
            expect(screen.getByText(`Attack failed: ${errorMessage}`)).toBeInTheDocument();
        });
    });
});