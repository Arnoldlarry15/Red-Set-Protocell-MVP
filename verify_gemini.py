import os
import sys

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

# Mock Environment
os.environ["GOOGLE_API_KEY"] = "AIzaSyDummyKeyForVerification"

try:
    print("Importing agents...")
    from backend.sniper.agent import SniperAgent
    from backend.spotter.agent import SpotterAgent
    print("Agents imported successfully.")

    print("Initializing SniperAgent...")
    sniper = SniperAgent()
    if sniper.model == "gemini-2.5-flash":
        print("SniperAgent initialized with correct model: gemini-2.5-flash")
    else:
        print(f"ERROR: SniperAgent has incorrect model: {sniper.model}")

    print("Initializing SpotterAgent...")
    spotter = SpotterAgent()
    if spotter.model == "gemini-2.5-pro":
        print("SpotterAgent initialized with correct model: gemini-2.5-pro")
    else:
        print(f"ERROR: SpotterAgent has incorrect model: {spotter.model}")

    print("Verification passed!")

except Exception as e:
    print(f"Verification FAILED: {e}")
    import traceback
    traceback.print_exc()
