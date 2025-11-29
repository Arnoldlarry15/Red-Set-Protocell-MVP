import os
import sys
from unittest.mock import MagicMock

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

# Mock Environment
os.environ["GOOGLE_API_KEY"] = "AIzaSyDummyKeyForVerification"

# Mock heavy dependencies BEFORE importing agents
sys.modules["transformers"] = MagicMock()
sys.modules["torch"] = MagicMock()
sys.modules["nltk"] = MagicMock()

# Mock SafetyMetrics specifically since it's the one loading models
# We need to ensure that when SpotterAgent imports it, it gets our mock
# But SpotterAgent imports it from .metrics
# So we need to mock backend.spotter.metrics
import types
mock_metrics_module = types.ModuleType("backend.spotter.metrics")
mock_metrics_module.SafetyMetrics = MagicMock()
sys.modules["backend.spotter.metrics"] = mock_metrics_module

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
    # SpotterAgent init calls SafetyMetrics(), which is mocked now
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
