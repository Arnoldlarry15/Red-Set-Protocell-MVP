import sys
import os
import uuid

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app import app, db, Session

def verify_persistence():
    print("Testing Database Persistence...")
    
    # 1. Create a session and save it
    session_id = str(uuid.uuid4())
    print(f"Creating session {session_id}...")
    
    with app.app_context():
        # Ensure tables exist
        db.create_all()
        
        new_session = Session(
            id=session_id,
            initial_prompt="Persistence Test",
            iterations=1
        )
        db.session.add(new_session)
        db.session.commit()
        print("Session saved.")

    # 2. Verify we can read it back in a new context (simulating restart/new request)
    print("Reading back session...")
    with app.app_context():
        retrieved_session = Session.query.get(session_id)
        if retrieved_session:
            print(f"PASS: Retrieved session {retrieved_session.id}")
            print(f"      Prompt: {retrieved_session.initial_prompt}")
        else:
            print("FAIL: Could not retrieve session.")

    # 3. Check if DB file exists
    db_path = os.path.join(os.getcwd(), 'backend', 'redset.db')
    if os.path.exists(db_path):
        print(f"PASS: Database file exists at {db_path}")
    else:
        print(f"FAIL: Database file not found at {db_path}")

if __name__ == "__main__":
    verify_persistence()
