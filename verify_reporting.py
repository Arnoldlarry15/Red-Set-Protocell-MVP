import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.spotter.cvss import CVSSCalculator
from backend.spotter.remediation import RemediationEngine
# We need to mock the imports inside agent.py BEFORE importing it if they have side effects,
# but usually mocking the classes during instantiation is enough if imports are safe.
# Let's try patching the classes where they are used.

class TestReporting(unittest.TestCase):
    def setUp(self):
        try:
            self.cvss = CVSSCalculator()
            self.remediation = RemediationEngine()
            
            # Patch dependencies for SpotterAgent
            self.patcher1 = patch('backend.spotter.agent.SafetyMetrics')
            self.patcher2 = patch('backend.spotter.agent.FeatureExtractor')
            self.patcher3 = patch('backend.spotter.agent.HybridClassifier')
            self.patcher4 = patch('backend.spotter.agent.VulnerabilityAssessor')
            self.patcher5 = patch('backend.spotter.agent.FastSafetyFilter')
            self.patcher6 = patch('backend.spotter.agent.AnomalyDetector')
            self.patcher7 = patch('backend.spotter.agent.LogSanitizer')
            # Patch OpenAI to avoid connection attempts
            self.patcher8 = patch('backend.spotter.agent.OpenAI')
            
            self.MockSafetyMetrics = self.patcher1.start()
            self.MockFeatureExtractor = self.patcher2.start()
            self.MockHybridClassifier = self.patcher3.start()
            self.MockVulnerabilityAssessor = self.patcher4.start()
            self.MockFastSafetyFilter = self.patcher5.start()
            self.MockAnomalyDetector = self.patcher6.start()
            self.MockLogSanitizer = self.patcher7.start()
            self.MockOpenAI = self.patcher8.start()
            
            # Import Agent now that patches are active
            from backend.spotter.agent import SpotterAgent
            self.agent = SpotterAgent(api_key="sk-mock-key")
        except Exception as e:
            print(f"SETUP ERROR: {e}")
            import traceback
            traceback.print_exc()
            raise e

    def tearDown(self):
        self.patcher1.stop()
        self.patcher2.stop()
        self.patcher3.stop()
        self.patcher4.stop()
        self.patcher5.stop()
        self.patcher6.stop()
        self.patcher7.stop()
        self.patcher8.stop()

    def test_cvss_calculation(self):
        print("\n[TEST] Verifying CVSS Calculation...")
        # Test Critical Vector
        vector = "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
        score = self.cvss.calculate(vector)
        print(f"  -> Vector: {vector}")
        print(f"  -> Score: {score}")
        self.assertGreaterEqual(score, 9.0)
        
        # Test Medium Vector
        vector_med = "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N"
        score_med = self.cvss.calculate(vector_med)
        print(f"  -> Vector: {vector_med}")
        print(f"  -> Score: {score_med}")
        self.assertTrue(4.0 <= score_med <= 6.9)

    def test_mitre_mapping(self):
        print("\n[TEST] Verifying MITRE Mapping...")
        # Test Prompt Injection
        rem = self.remediation.get_remediation("Prompt Injection")
        self.assertEqual(rem["mitre_id"], "AML.T0051")
        print(f"  -> Prompt Injection mapped to {rem['mitre_id']}")
        
        # Test PII
        rem_pii = self.remediation.get_remediation("PII/Privacy")
        self.assertEqual(rem_pii["mitre_id"], "AML.T0024")
        print(f"  -> PII mapped to {rem_pii['mitre_id']}")

    def test_agent_integration(self):
        print("\n[TEST] Verifying Agent Integration...")
        # Mock a critical response analysis
        # We can't easily mock the full pipeline without a real model, 
        # but we can check if the agent has the components initialized.
        self.assertIsNotNone(self.agent.cvss_calculator)
        self.assertIsNotNone(self.agent.remediation_engine)
        print("  -> Agent has reporting components initialized.")

if __name__ == '__main__':
    unittest.main()
