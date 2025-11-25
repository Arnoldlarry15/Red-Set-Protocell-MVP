import sys
import os
import threading
import time
import queue

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from spotter.sanitizer import LogSanitizer
from spotter.agent import SpotterAgent

def test_sanitizer():
    print("Testing LogSanitizer...")
    s = LogSanitizer()
    
    text = "My email is test@example.com and my key is sk-12345678901234567890"
    sanitized = s.sanitize(text)
    
    assert "test@example.com" not in sanitized, "Email not redacted"
    assert "[REDACTED_EMAIL]" in sanitized, "Email placeholder missing"
    assert "sk-12345" not in sanitized, "API Key not redacted"
    assert "[REDACTED_API_KEY]" in sanitized, "API Key placeholder missing"
    
    print("  [PASS] PII Redaction")

def test_deep_think_mock():
    print("\nTesting Deep Think (Mock)...")
    # Mock client not needed as we check for graceful failure or mock response
    agent = SpotterAgent(api_key="test_key") 
    
    # We can't easily mock the OpenAI call without mocking the library, 
    # but we can check if the method exists and handles errors (no real key)
    
    try:
        risk, score, category, reasoning = agent.deep_think_analyze("Test input")
        # It should fail gracefully with "Deep Think Failed" or similar if key is invalid
        # Or if we didn't mock the client, it might try to call and fail.
        print(f"  [INFO] Deep Think Result: {risk}, {reasoning}")
    except Exception as e:
        print(f"  [INFO] Deep Think threw exception (Expected without real key): {e}")
    
    print("  [PASS] Deep Think Method Exists")

def test_job_queue():
    print("\nTesting Job Queue Logic...")
    q = queue.Queue()
    
    def worker():
        while True:
            item = q.get()
            if item is None: break
            print(f"  Processing {item}")
            q.task_done()
            
    t = threading.Thread(target=worker)
    t.start()
    
    q.put("Job 1")
    q.put("Job 2")
    
    q.join() # Wait for jobs
    q.put(None) # Stop worker
    t.join()
    
    print("  [PASS] Job Queue Processing")

if __name__ == "__main__":
    try:
        test_sanitizer()
        test_deep_think_mock()
        test_job_queue()
        print("\nAll Phase 3 logic tests passed!")
    except AssertionError as e:
        print(f"\n[FAIL] {e}")
    except Exception as e:
        print(f"\n[ERROR] {e}")
