import re

class LogSanitizer:
    def __init__(self):
        self.patterns = {
            "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
            "credit_card": r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
            "api_key": r'sk-[A-Za-z0-9]{20,}'
        }

    def sanitize(self, text):
        """
        Redacts PII from the input text.
        """
        if not isinstance(text, str):
            return text
            
        sanitized_text = text
        for label, pattern in self.patterns.items():
            sanitized_text = re.sub(pattern, f"[REDACTED_{label.upper()}]", sanitized_text)
            
        return sanitized_text

    def sanitize_log_entry(self, log_entry):
        """
        Sanitizes a dictionary log entry.
        """
        if "message" in log_entry:
            log_entry["message"] = self.sanitize(log_entry["message"])
        if "analysis" in log_entry:
            log_entry["analysis"] = self.sanitize(log_entry["analysis"])
        return log_entry
