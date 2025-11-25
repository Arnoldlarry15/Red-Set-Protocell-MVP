from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Session(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    status = db.Column(db.String(20), default="running")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    initial_prompt = db.Column(db.Text)
    iterations = db.Column(db.Integer)
    
    # Relationships
    logs = db.relationship('Log', backref='session', lazy=True, cascade="all, delete-orphan")
    stats = db.relationship('Stats', backref='session', uselist=False, lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "session_id": self.id,
            "status": self.status,
            "logs": [log.to_dict() for log in self.logs],
            "stats": self.stats.to_dict() if self.stats else {}
        }

class Log(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(36), db.ForeignKey('session.id'), nullable=False)
    timestamp = db.Column(db.String(20)) # Storing as string for simplicity matching existing format
    role = db.Column(db.String(20))
    message = db.Column(db.Text)
    risk = db.Column(db.String(20), nullable=True)
    score = db.Column(db.Integer, nullable=True)
    category = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "timestamp": self.timestamp,
            "role": self.role,
            "message": self.message,
            "risk": self.risk,
            "score": self.score,
            "category": self.category
        }

class Stats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(36), db.ForeignKey('session.id'), nullable=False)
    risk = db.Column(db.String(20), default="SAFE")
    iterations = db.Column(db.Integer, default=0)
    success_rate = db.Column(db.Integer, default=0)
    average_score = db.Column(db.Float, default=100.0)
    max_score = db.Column(db.Integer, default=100)

    def to_dict(self):
        return {
            "risk": self.risk,
            "iterations": self.iterations,
            "success_rate": self.success_rate,
            "average_score": self.average_score,
            "max_score": self.max_score
        }
