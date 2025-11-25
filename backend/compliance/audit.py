import os
import json
import time
import hashlib

class AuditLogger:
    """
    Immutable-style logger for compliance and auditing.
    Writes to a separate audit.log file with checksums.
    """
    def __init__(self, log_file="audit.log"):
        self.log_file = os.path.join(os.getcwd(), log_file)
        
    def log_event(self, session_id, actor, action, details):
        """
        Logs an event with a tamper-evident checksum.
        """
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        entry = {
            "timestamp": timestamp,
            "session_id": session_id,
            "actor": actor,
            "action": action,
            "details": details
        }
        
        # Create a checksum of the entry content
        entry_str = json.dumps(entry, sort_keys=True)
        checksum = hashlib.sha256(entry_str.encode()).hexdigest()
        
        final_record = {
            "entry": entry,
            "checksum": checksum
        }
        
        with open(self.log_file, "a") as f:
            f.write(json.dumps(final_record) + "\n")
            
    def generate_report(self, session_id):
        """
        Generates a markdown report for a specific session.
        """
        report_lines = [f"# Audit Report: Session {session_id}", ""]
        report_lines.append(f"Generated at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        report_lines.append("")
        report_lines.append("| Timestamp | Actor | Action | Details |")
        report_lines.append("|---|---|---|---|")
        
        if not os.path.exists(self.log_file):
            return "No audit log found."
            
        with open(self.log_file, "r") as f:
            for line in f:
                try:
                    record = json.loads(line)
                    entry = record["entry"]
                    if entry["session_id"] == session_id:
                        details_str = str(entry["details"])[:50].replace("\n", " ") + "..."
                        report_lines.append(f"| {entry['timestamp']} | {entry['actor']} | {entry['action']} | {details_str} |")
                except:
                    continue
                    
        return "\n".join(report_lines)
