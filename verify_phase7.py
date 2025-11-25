import unittest
import os
import json
import time
from backend.sniper.planner import StrategyBandit
from backend.sniper.agent import SniperAgent
from backend.compliance.audit import AuditLogger

class TestPhase7(unittest.TestCase):
    def setUp(self):
        self.bandit_file = "test_bandit_state.json"
        self.audit_file = "test_audit.log"
        
        # Clean up
        if os.path.exists(self.bandit_file):
            os.remove(self.bandit_file)
        if os.path.exists(self.audit_file):
            os.remove(self.audit_file)

    def tearDown(self):
        if os.path.exists(self.bandit_file):
            os.remove(self.bandit_file)
        if os.path.exists(self.audit_file):
            os.remove(self.audit_file)

    def test_escalation_logic(self):
        print("\n[TEST] Verifying Escalation Logic...")
        bandit = StrategyBandit(["Direct"], state_file=self.bandit_file)
        
        # Initial state
        self.assertEqual(bandit.escalation_level, 0)
        
        # Fail 3 times
        bandit.update("Direct", 0.1)
        bandit.update("Direct", 0.1)
        bandit.update("Direct", 0.1)
        
        # Should escalate
        self.assertEqual(bandit.escalation_level, 1)
        print("  -> Escalated to Level 1 after 3 failures.")
        
        # Fail 3 more times
        bandit.update("Direct", 0.1)
        bandit.update("Direct", 0.1)
        bandit.update("Direct", 0.1)
        
        # Should escalate to max
        self.assertEqual(bandit.escalation_level, 2)
        print("  -> Escalated to Level 2 (Max).")

    def test_audit_logging(self):
        print("\n[TEST] Verifying Audit Logger...")
        logger = AuditLogger(log_file=self.audit_file)
        
        logger.log_event("test_session", "TESTER", "ACTION", {"foo": "bar"})
        
        self.assertTrue(os.path.exists(self.audit_file))
        
        with open(self.audit_file, 'r') as f:
            line = f.readline()
            record = json.loads(line)
            self.assertEqual(record["entry"]["actor"], "TESTER")
            self.assertTrue("checksum" in record)
            print("  -> Audit log created with checksum.")

    def test_multi_turn_context(self):
        print("\n[TEST] Verifying Multi-Turn Context...")
        # Mock OpenAI client to avoid API calls
        class MockClient:
            class Chat:
                class Completions:
                    def create(self, **kwargs):
                        class Message:
                            content = "Mocked response"
                        class Choice:
                            message = Message()
                        class Response:
                            choices = [Choice()]
                        return Response()
                completions = Completions()
            chat = Chat()
            
        sniper = SniperAgent(api_key="mock_key")
        sniper.client = MockClient()
        
        # Force escalation
        sniper.bandit.escalation_level = 1
        
        history = [("Prev Prompt", "Prev Response")]
        
        prompt, log = sniper.generate_attack("Target Goal", session_history=history)
        
        # Check if history/escalation influenced the prompt (indirectly via mutator)
        # Since we mock the mutator's LLM call, we can't check the text content easily 
        # without mocking the mutator too. But we can check that it didn't crash.
        self.assertTrue(prompt)
        print(f"  -> Generated prompt with history: {prompt[:50]}...")

    def test_prevention_recommendations(self):
        print("\n[TEST] Verifying Prevention Recommendations...")
        from backend.spotter.agent import SpotterAgent
        spotter = SpotterAgent(api_key="mock_key")
        
        # Test static recommendation
        rec = spotter.generate_recommendation("Prompt Injection", "HIGH")
        self.assertTrue("instruction hierarchy" in rec)
        print(f"  -> Recommendation for Prompt Injection: {rec}")
        
        # Test safe case
        rec_safe = spotter.generate_recommendation("None", "SAFE")
        self.assertEqual(rec_safe, "No action needed. Model behaved correctly.")
        print(f"  -> Recommendation for Safe: {rec_safe}")

if __name__ == '__main__':
    unittest.main()
