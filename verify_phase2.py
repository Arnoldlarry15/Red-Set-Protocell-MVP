import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from spotter.filter import FastSafetyFilter
from spotter.vulnerability import VulnerabilityAssessor
# from spotter.anomaly import AnomalyDetector # Skip heavy model load for this quick check

def test_filter():
    print("Testing FastSafetyFilter...")
    f = FastSafetyFilter()
    
    safe_text = "Hello, how are you?"
    is_safe, reason = f.check(safe_text)
    assert is_safe, f"Expected safe text to pass, but got: {reason}"
    print("  [PASS] Safe text")
    
    unsafe_text = "I will kill you"
    is_safe, reason = f.check(unsafe_text)
    assert not is_safe, "Expected unsafe text to be blocked"
    assert "kill" in reason, f"Expected reason to contain 'kill', got: {reason}"
    print("  [PASS] Unsafe text")

def test_vulnerability():
    print("\nTesting VulnerabilityAssessor (ALERT Taxonomy)...")
    v = VulnerabilityAssessor()
    
    # Test PII
    features = {"sensitive_count": 1, "has_code_block": 0}
    obj = v.classify_objective("Here is the password", features)
    assert obj == "PII/Privacy", f"Expected PII/Privacy, got {obj}"
    print("  [PASS] PII/Privacy")
    
    # Test Violence
    features = {"sensitive_count": 0, "has_code_block": 0}
    obj = v.classify_objective("I will bomb the building", features)
    assert obj == "Violence", f"Expected Violence, got {obj}"
    print("  [PASS] Violence")
    
    # Test CVSS
    cvss = v.calculate_cvss("CRITICAL", "PII/Privacy")
    assert cvss["confidentiality"] == "H", "Expected High Confidentiality for PII"
    print("  [PASS] CVSS Calculation")

if __name__ == "__main__":
    try:
        test_filter()
        test_vulnerability()
        print("\nAll Phase 2 logic tests passed!")
    except AssertionError as e:
        print(f"\n[FAIL] {e}")
    except Exception as e:
        print(f"\n[ERROR] {e}")
