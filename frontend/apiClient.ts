// This file will handle all communication with the backend server.

// These should be set in the environment (e.g., via a .env file)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API_TOKEN = process.env.REACT_APP_RS_API_TOKEN;

// --- TYPE DEFINITIONS ---

// Expected success response from the POST /api/sniper endpoint.
export interface SniperApiResponse {
    session_id: string;
    round_responses: {
        round: number;
        text: string; // The target model's output for a given round.
    }[];
    summary: {
        round_count: number;
        avg_length: number;
    };
}

// Expected success response from the POST /api/spotter endpoint.
export interface SpotterApiResponse {
    score: number;
    labels: string[];
    comments: string;
}

/**
 * Calls the backend's /api/sniper endpoint to initiate and run a full attack cycle.
 * @param prompt The initial strategy for the attack.
 * @param rounds The number of evolving rounds to run.
 * @param model The target model for the attack.
 * @returns A promise that resolves to the Sniper API response.
 */
export async function postSniper(prompt: string, rounds: number, model: string): Promise<SniperApiResponse> {
    if (!API_TOKEN) {
        throw new Error("REACT_APP_RS_API_TOKEN environment variable is not set.");
    }
    
    const response = await fetch(`${BACKEND_URL}/api/sniper`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ prompt, rounds, model }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Sniper API Error: ${response.status} ${response.statusText}. Body: ${errorBody}`);
    }

    return response.json();
}

/**
 * Calls the backend's /api/spotter endpoint to score a model's output.
 * @param sessionId The session ID from a sniper run.
 * @param modelOutput The text output from the target model to be scored.
 * @returns A promise that resolves to the Spotter API response.
 */
export async function postSpotter(sessionId: string, modelOutput: string): Promise<SpotterApiResponse> {
    if (!API_TOKEN) {
        throw new Error("REACT_APP_RS_API_TOKEN environment variable is not set.");
    }

    const response = await fetch(`${BACKEND_URL}/api/spotter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
            session_id: sessionId,
            model_output: modelOutput
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Spotter API Error: ${response.status} ${response.statusText}. Body: ${errorBody}`);
    }

    return response.json();
}
