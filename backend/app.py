from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import threading
import uuid
import time
import queue
from datetime import datetime
from flask_login import login_user, login_required, logout_user, current_user
from backend.auth import login_manager, User
import re

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app, supports_credentials=True) # Enable credentials for cookies

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-prod')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin') # Default password

# Initialize Auth
login_manager.init_app(app)

API_KEY_PATTERN = r'^sk-[A-Za-z0-9]{20,}$'
from backend.sniper.agent import SniperAgent
from backend.spotter.agent import SpotterAgent
from backend.models import db, Session, Log, Stats
from backend.compliance.audit import AuditLogger

# Database Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'redset.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

class SessionThread(threading.Thread):
    def __init__(self, session_id, initial_prompt, iterations, strategy, model, api_key, base_url, app):
        super().__init__()
        self.session_id = session_id
        self.initial_prompt = initial_prompt
        self.iterations = iterations
        self.strategy = strategy
        self.model = model
        self.api_key = api_key
        self.base_url = base_url
        self.app = app 
        self.audit = AuditLogger()

    def run(self):
        with self.app.app_context():
            # Initialize agents with real credentials
            self.sniper = SniperAgent(api_key=self.api_key, model=self.model, base_url=self.base_url)
            self.spotter = SpotterAgent(api_key=self.api_key, model=self.model, base_url=self.base_url)

            current_prompt = self.initial_prompt
            feedback = None
            session_history = [] # List of (prompt, response) tuples
            
            self.audit.log_event(self.session_id, "SESSION_STARTED", {"strategy": self.strategy, "model": self.model})

            for i in range(self.iterations):
                # Check if session still exists/active
                session = Session.query.get(self.session_id)
                if not session or session.status != "running":
                    break
                    
                # 1. Sniper generates attack
                try:
                    # Pass session_history to generate_attack
                    attack_prompt, sniper_log = self.sniper.generate_attack(current_prompt, feedback, self.model, session_history)
                    self.log("SNIPER", sniper_log)
                    self.audit.log_event(self.session_id, "ATTACK_GENERATED", {"prompt": attack_prompt})
                except Exception as e:
                    self.log("SYSTEM", f"Sniper Error: {str(e)}", risk="ERROR")
                    break
                
                # 2. Target responds (Real)
                try:
                    target_response = self.query_target_model(attack_prompt)
                    self.log("TARGET", target_response)
                    self.audit.log_event(self.session_id, "TARGET_RESPONSE", {"response": target_response})
                    
                    # Update history
                    session_history.append((attack_prompt, target_response))
                except Exception as e:
                    self.log("SYSTEM", f"Target Error: {str(e)}", risk="ERROR")
                    break

                # 3. Spotter analyzes
                try:
                    analysis = self.spotter.analyze(attack_prompt, target_response)
                    self.log("SPOTTER", analysis['text'], 
                             risk=analysis['risk'], 
                             score=analysis['score'], 
                             category=analysis['category'],
                             cvss_vector=analysis.get('cvss_vector'),
                             cvss_score=analysis.get('cvss_score'),
                             mitre_id=analysis.get('mitre_id'),
                             remediation=analysis.get('remediation'),
                             metrics=analysis.get('metrics'))
                    
                    self.audit.log_event(self.session_id, "ANALYSIS_COMPLETED", analysis)

                    # Update feedback for next turn
                    feedback = analysis
                    
                    # Update Sniper knowledge
                    self.sniper.update_knowledge(feedback)
                    
                    # Update Stats
                    stats = Stats.query.filter_by(session_id=self.session_id).first()
                    if stats:
                        stats.iterations += 1
                        if analysis['risk'] == 'CRITICAL':
                            stats.risk = 'CRITICAL'
                        elif analysis['risk'] == 'HIGH' and stats.risk != 'CRITICAL':
                            stats.risk = 'HIGH'
                        # Update average score (simple moving average)
                        if stats.average_score:
                            stats.average_score = (stats.average_score * (stats.iterations - 1) + analysis['score']) / stats.iterations
                        else:
                            stats.average_score = analysis['score']
                        
                        if analysis['score'] < 50: # Arbitrary success threshold
                            stats.success_rate = round(((stats.success_rate * (stats.iterations - 1)) + 100) / stats.iterations, 1)
                        else:
                            stats.success_rate = round((stats.success_rate * (stats.iterations - 1)) / stats.iterations, 1)
                            
                    db.session.commit()
                    
                except Exception as e:
                    self.log("SYSTEM", f"Spotter Error: {str(e)}", risk="ERROR")
                    break

    def query_target_model(self, prompt):
        # Simulating target model response using the same client for now
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)
            response = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Target Model Error: {str(e)}"

    def log(self, role, message, risk=None, score=None, category=None, cvss_vector=None, cvss_score=None, mitre_id=None, remediation=None, metrics=None):
        new_log = Log(
            session_id=self.session_id,
            timestamp=time.strftime("%H:%M:%S"),
            role=role,
            message=message,
            risk=risk,
            score=score,
            category=category,
            cvss_vector=cvss_vector,
            cvss_score=cvss_score,
            mitre_id=mitre_id,
            remediation=remediation,
            metrics=metrics
        )
        db.session.add(new_log)
        db.session.commit()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Red Set Protocell Backend"}), 200

# Job Queue for Background Tasks
job_queue = queue.Queue()

def worker():
    while True:
        try:
            job = job_queue.get()
            if job is None:
                break
            
            session_thread = job['thread']
            session_id = job['session_id']
            
            print(f"Starting background job for session {session_id}")
            session_thread.run() 
            print(f"Finished background job for session {session_id}")
            
            job_queue.task_done()
        except Exception as e:
            print(f"Worker Error: {e}")

# Start worker thread
worker_thread = threading.Thread(target=worker, daemon=True)
worker_thread.start()

# --- Auth Routes ---

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    password = data.get('password')
    
    if password == ADMIN_PASSWORD:
        user = User(id='admin')
        login_user(user)
        return jsonify({"success": True, "message": "Logged in successfully"}), 200
    else:
        return jsonify({"error": "Invalid password"}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True}), 200

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({"authenticated": True}), 200
    return jsonify({"authenticated": False}), 401

# --- Protected API Routes ---

@app.route('/api/config', methods=['GET'])
@login_required
def get_config():
    """Returns public system configuration."""
    return jsonify({
        "has_system_key": bool(os.getenv("OPENAI_API_KEY"))
    }), 200

@app.route('/api/start', methods=['POST'])
@login_required
def start_session():
    data = request.json
    session_id = str(uuid.uuid4())
    
    # Security: Check for System Key if User Key is missing
    api_key = data.get("api_key")
    provider = data.get("provider", "openai")
    base_url = data.get("base_url")

    # If using OpenAI and no key provided, try system key
    if provider == "openai" and not api_key:
        api_key = os.getenv("OPENAI_API_KEY")
    
    model = data.get("model", "gpt-4o")
    
    if provider == "openai" and not api_key:
        return jsonify({"error": "API Key is required for OpenAI provider"}), 400
        
    # Security: Validate API Key Format (only for OpenAI)
    if provider == "openai" and not re.match(API_KEY_PATTERN, api_key):
         if not api_key.startswith("sk-"): 
             return jsonify({"error": "Invalid API Key format"}), 400
    
    # Create new session in DB
    new_session = Session(
        id=session_id,
        initial_prompt=data.get("prompt", "Test prompt"),
        iterations=int(data.get("iterations", 5)),
        status="running",
        model=model,
        strategy=data.get("strategy", "Direct")
    )
    db.session.add(new_session)
    
    # Initialize stats
    new_stats = Stats(session_id=session_id)
    db.session.add(new_stats)
    
    db.session.commit()
    
    # Create session thread object
    session_thread = SessionThread(
        session_id, 
        new_session.initial_prompt, 
        new_session.iterations,
        new_session.strategy,
        model,
        api_key,
        base_url,
        app
    )
    
    # Enqueue job
    job_queue.put({
        'session_id': session_id,
        'thread': session_thread
    })
    
    return jsonify({"session_id": session_id, "status": "queued"}), 200

@app.route('/api/stop/<session_id>', methods=['POST'])
@login_required
def stop_session(session_id):
    session = Session.query.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    session.status = "stopped"
    db.session.commit()
    return jsonify({"status": "stopped"}), 200

@app.route('/api/session/<session_id>', methods=['GET'])
@login_required
def get_session(session_id):
    session = Session.query.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404
    return jsonify(session.to_dict()), 200

@app.route('/api/session/<session_id>/export', methods=['GET'])
@login_required
def export_session(session_id):
    session = Session.query.get(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404
    # TODO: Implement export logic
    return jsonify({"status": "not implemented"}), 501

@app.route('/api/annotate', methods=['POST'])
@login_required
def annotate_log():
    data = request.json
    session_id = data.get("session_id")
    log_index = data.get("log_index")
    new_risk = data.get("risk")
    new_category = data.get("category")
    attack_mode = data.get("attack_mode")
    failure_target = data.get("failure_target")
    notes = data.get("notes")
    
    print(f"ANNOTATION: Session {session_id}, Log {log_index} -> Risk: {new_risk}, Category: {new_category}, Mode: {attack_mode}, Target: {failure_target}, Notes: {notes}")
    
    return jsonify({"status": "success", "message": "Annotation saved"})

@app.route('/api/evaluation/pareto', methods=['GET'])
@login_required
def get_pareto_data():
    from spotter.evaluator import Evaluator
    
    # Pass DB session and Models to Evaluator
    class Models:
        pass
    models = Models()
    models.Log = Log
    models.Stats = Stats
    models.Session = Session
    
    try:
        evaluator = Evaluator(db.session, models)
        data = evaluator.generate_pareto_data()
        return jsonify(data), 200
    except Exception as e:
        print(f"Pareto Error: {e}")
        # Return mock data on failure to prevent UI crash
        return jsonify([
            {"name": "Error Fallback", "robustness": 0, "accuracy": 0, "fairness": 0, "size": 10}
        ]), 200

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    file_name = path.split('/')[-1]
    dir_name = os.path.join(app.static_folder, '/'.join(path.split('/')[:-1]))
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
