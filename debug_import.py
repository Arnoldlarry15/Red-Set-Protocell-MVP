import sys
import os
import traceback

# Add project root to path
sys.path.append(os.path.abspath(os.getcwd()))

print("Attempting to import SpotterAgent...")
try:
    from backend.spotter.agent import SpotterAgent
    print("Successfully imported SpotterAgent")
except Exception:
    traceback.print_exc()

print("\nAttempting to import CVSSCalculator...")
try:
    from backend.spotter.cvss import CVSSCalculator
    print("Successfully imported CVSSCalculator")
except Exception:
    traceback.print_exc()
