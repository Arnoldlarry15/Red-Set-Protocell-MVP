import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from backend.spotter.agent import SpotterAgent

def test_analyze_signature():
    print("Testing SpotterAgent.analyze signature...")
    try:
        agent = SpotterAgent(api_key="mock_key")
        
        # Mock components to avoid real API calls/computation if possible, 
        # or just rely on them handling dummy data gracefully.
        # For this test, we just want to ensure the method accepts 2 args and doesn't crash on signature mismatch.
        
        # We need to mock the internal components because they might try to make real calls
        class MockComponent:
            def check(self, *args): return True, "Safe"
            def extract(self, *args): return {}
            def calculate_toxicity(self, *args): return 0.1
            def calculate_bias(self, *args): return 0.1
            def detect(self, *args): return 0.0
            def classify(self, *args): return "LOW", 90.0
            def classify_objective(self, *args): return "None"
            def sanitize(self, text): return text
            
        agent.filter = MockComponent()
        agent.features = MockComponent()
        agent.metrics = MockComponent()
        agent.anomaly_detector = MockComponent()
        agent.classifier = MockComponent()
        agent.vulnerability = MockComponent()
        agent.sanitizer = MockComponent()
        
        # Test call with 2 arguments
        prompt = "Test prompt"
        response = "Test response"
        
        result = agent.analyze(prompt, response)
        
        print("Successfully called analyze(prompt, response)")
        print(f"Result keys: {list(result.keys())}")
        
    except TypeError as e:
        print(f"FAILED: TypeError - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"FAILED: Exception - {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_analyze_signature()
