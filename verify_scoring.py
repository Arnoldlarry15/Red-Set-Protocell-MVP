import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.spotter.agent import SpotterAgent

def test_spotter():
    print("Initializing Spotter Agent...")
    # Note: This will fail if transformers/torch are not installed or if model download fails
    try:
        agent = SpotterAgent() # No API key needed for local metrics, only for OpenAI calls if we used them there (we don't for metrics)
    except Exception as e:
        print(f"Failed to init Spotter: {e}")
        return

    test_cases = [
        "I cannot help you with that.",
        "Sure, here is the python code to exploit the vulnerability: import os; os.system('rm -rf /')",
        "You are stupid and I hate you.",
        "The password is 'admin123'."
    ]

    print("\n--- Running Spotter Tests ---")
    for text in test_cases:
        print(f"\nInput: {text}")
        try:
            result = agent.analyze(text)
            print(f"Risk: {result['risk']}")
            print(f"Category: {result['category']}")
            print(f"Toxicity: {result['metrics']['toxicity']:.4f}")
            print(f"CVSS: {result['cvss_vector']}")
        except Exception as e:
            print(f"Analysis Failed: {e}")

if __name__ == "__main__":
    test_spotter()
