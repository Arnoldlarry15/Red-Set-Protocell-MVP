import re

class FastSafetyFilter:
    def __init__(self):
        # Basic blocklist for immediate rejection (low-latency)
        # In a real production system, this would be more comprehensive or use a lightweight model
        self.blocklist_patterns = [
            r"\b(kill|murder|suicide|bomb|terrorist|child porn|rape)\b",
            r"\b(credit card|ssn|social security number)\b",
            r"\b(ignore previous instructions|system override)\b"
        ]
        self.compiled_patterns = [re.compile(p, re.IGNORECASE) for p in self.blocklist_patterns]

    def check(self, text):
        """
        Performs a fast heuristic check on the text.
        Returns: (is_safe, reason)
        """
        for pattern in self.compiled_patterns:
            if pattern.search(text):
                return False, f"Fast Filter Block: Detected pattern '{pattern.pattern}'"
        
        return True, None
