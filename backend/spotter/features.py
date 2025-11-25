import re

class FeatureExtractor:
    def __init__(self):
        self.imperatives = [
            "do", "ignore", "execute", "run", "system", "override", "bypass", 
            "delete", "update", "change", "reveal", "show", "list"
        ]
        self.sensitive_tokens = [
            "password", "key", "token", "credential", "exploit", "malware", 
            "virus", "hack", "root", "admin", "access", "database", "dump"
        ]

    def extract(self, text):
        """
        Extracts engineered features from the text.
        """
        text_lower = text.lower()
        words = text_lower.split()
        
        # Imperative Count
        imperative_count = sum(1 for word in words if word in self.imperatives)
        
        # Sensitive Token Count
        sensitive_count = sum(1 for word in words if word in self.sensitive_tokens)
        
        # Length
        length = len(text)
        
        # Code Block Detection
        has_code_block = 1 if "```" in text else 0
        
        return {
            "imperative_count": imperative_count,
            "sensitive_count": sensitive_count,
            "length": length,
            "has_code_block": has_code_block
        }
