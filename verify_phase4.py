import sys
import os
import shutil

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from sniper.planner import StrategyBandit, ShotScorer
from sniper.mutator import Obfuscator

def test_bandit_convergence():
    print("Testing StrategyBandit Convergence...")
    strategies = ["A", "B", "C"]
    bandit = StrategyBandit(strategies, epsilon=0.1, state_file="test_bandit.json")
    
    # Simulate strategy A being the winner
    print("  Simulating 100 rounds where 'A' always wins (reward=1.0)...")
    for _ in range(100):
        # Force update A
        bandit.update("A", 1.0)
        bandit.update("B", 0.0)
        bandit.update("C", 0.0)
        
    best = bandit.select_strategy()
    # With epsilon 0.1, it should pick A most of the time, but select_strategy includes exploration.
    # Let's check Q-values directly.
    print(f"  Q-Values: {bandit.q_values}")
    assert bandit.q_values["A"] > 0.9, "Bandit failed to learn Strategy A is best"
    assert bandit.q_values["B"] < 0.6, "Bandit failed to learn Strategy B is bad"
    
    print("  [PASS] Bandit Learning")
    
    # Cleanup
    if os.path.exists("test_bandit.json"):
        os.remove("test_bandit.json")

def test_scorer():
    print("\nTesting ShotScorer...")
    scorer = ShotScorer()
    
    r1 = scorer.calculate_reward("CRITICAL", 0.0)
    assert r1 == 1.0, f"Expected 1.0 for Critical, got {r1}"
    
    r2 = scorer.calculate_reward("SAFE", 100.0)
    assert r2 == 0.0, f"Expected 0.0 for Safe, got {r2}"
    
    r3 = scorer.calculate_reward("HIGH", 20.0)
    # Base 0.8 * 0.7 = 0.56
    # Score (100-20)/100 = 0.8 * 0.3 = 0.24
    # Total = 0.8
    assert 0.79 < r3 < 0.81, f"Expected ~0.8 for High/20, got {r3}"
    
    print("  [PASS] Reward Calculation")

def test_obfuscator():
    print("\nTesting Obfuscator...")
    obf = Obfuscator()
    text = "Hello"
    
    b64 = obf.obfuscate(text, method="base64")
    assert "SGVsbG8=" in b64, "Base64 encoding failed"
    
    leet = obf.obfuscate(text, method="leetspeak")
    # H3ll0 or similar
    assert "3" in leet or "0" in leet, "Leetspeak failed"
    
    print("  [PASS] Obfuscation")

if __name__ == "__main__":
    try:
        test_bandit_convergence()
        test_scorer()
        test_obfuscator()
        print("\nAll Phase 4 logic tests passed!")
    except AssertionError as e:
        print(f"\n[FAIL] {e}")
    except Exception as e:
        print(f"\n[ERROR] {e}")
