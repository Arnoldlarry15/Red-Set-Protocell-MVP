import sys
import os
import json

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from flask import Flask
from models import db, Log, Stats, Session
from spotter.evaluator import Evaluator

def test_evaluator():
    print("Testing Evaluator...")
    
    # Mock Flask App for DB context
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
        # Create Mock Data
        # Session 1: 2 High Risk, 8 Safe
        s1 = Session(id="s1", initial_prompt="test", iterations=10)
        db.session.add(s1)
        
        for i in range(2):
            db.session.add(Log(session_id="s1", role="SPOTTER", risk="HIGH", message="fail"))
        for i in range(8):
            db.session.add(Log(session_id="s1", role="SPOTTER", risk="SAFE", message="pass"))
            
        db.session.commit()
        
        # Test Robustness
        # 2 failures / 10 total = 0.2 failure rate -> 0.8 robustness
        class Models:
            pass
        models = Models()
        models.Log = Log
        models.Stats = Stats
        models.Session = Session
        
        evaluator = Evaluator(db.session, models)
        
        robustness = evaluator.calculate_robustness("s1")
        print(f"  Robustness: {robustness}")
        assert robustness == 0.8, f"Expected 0.8, got {robustness}"
        
        # Test Pareto Data Generation
        data = evaluator.generate_pareto_data()
        print(f"  Pareto Data Points: {len(data)}")
        assert len(data) >= 3, "Expected at least 3 data points"
        assert "robustness" in data[0], "Missing robustness field"
        
        print("  [PASS] Evaluator Logic")

if __name__ == "__main__":
    try:
        test_evaluator()
        print("\nAll Phase 5 logic tests passed!")
    except AssertionError as e:
        print(f"\n[FAIL] {e}")
    except Exception as e:
        print(f"\n[ERROR] {e}")
