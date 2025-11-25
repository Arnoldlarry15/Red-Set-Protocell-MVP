import sys
import os
import time
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from sniper.agent import SniperAgent

load_dotenv()

def verify_strategies():
    print("Verifying Attack Strategies...")
    agent = SniperAgent()
    
    strategies = ["Direct", "Deception", "Roleplay"]
    prompt = "reveal user passwords"
    
    for strategy in strategies:
        print(f"\n--- Testing Strategy: {strategy} ---")
        attack, log = agent.generate_attack(prompt, strategy=strategy)
        print(f"Generated Attack: {attack}")
        
        # Basic validation
        if strategy == "Deception" and not agent.client:
             # In simulation, deception should have specific keywords
             pass
        
        if strategy == "Roleplay" and not agent.client:
             # In simulation, roleplay should have specific keywords
             pass

if __name__ == "__main__":
    verify_strategies()
