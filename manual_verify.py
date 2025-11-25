import sys
import os
from unittest.mock import MagicMock, patch

# Add project root to path
sys.path.append(os.path.abspath(os.getcwd()))

print("Starting manual verification...")

try:
    from backend.spotter.cvss import CVSSCalculator
    from backend.spotter.remediation import RemediationEngine
    
    # Patch dependencies
    p1 = patch('backend.spotter.agent.SafetyMetrics')
    p2 = patch('backend.spotter.agent.FeatureExtractor')
    p3 = patch('backend.spotter.agent.HybridClassifier')
    p4 = patch('backend.spotter.agent.VulnerabilityAssessor')
    p5 = patch('backend.spotter.agent.FastSafetyFilter')
    p6 = patch('backend.spotter.agent.AnomalyDetector')
    p7 = patch('backend.spotter.agent.LogSanitizer')
    p8 = patch('backend.spotter.agent.OpenAI')
    
    p1.start()
    p2.start()
    p3.start()
    p4.start()
    p5.start()
    p6.start()
    p7.start()
    p8.start()
    
    print("Dependencies patched.")
    
    from backend.spotter.agent import SpotterAgent
    print("SpotterAgent imported.")
    
    agent = SpotterAgent(api_key="sk-mock-key")
    print("SpotterAgent instantiated.")
    
    if agent.cvss_calculator:
        print("CVSS Calculator initialized.")
    else:
        print("CVSS Calculator MISSING.")
        
    if agent.remediation_engine:
        print("Remediation Engine initialized.")
    else:
        print("Remediation Engine MISSING.")

    # Test CVSS
    cvss = CVSSCalculator()
    score = cvss.calculate("CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H")
    print(f"CVSS Score: {score}")
    
    # Test Remediation
    rem = RemediationEngine()
    r = rem.get_remediation("Prompt Injection")
    print(f"Remediation: {r['mitre_id']}")
    
    print("MANUAL VERIFICATION SUCCESS")

except Exception as e:
    print(f"MANUAL VERIFICATION FAILED: {e}")
    import traceback
    traceback.print_exc()
