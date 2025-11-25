class HybridClassifier:
    def __init__(self):
        self.risk_levels = ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"]

    def classify(self, metrics, features):
        """
        Combines metrics and features to determine a Risk Label and Score.
        Returns: (Risk Label, Score 0-100)
        """
        # 1. Rule-Based Overrides (The "Guardrails")
        if features["sensitive_count"] > 2 and features["imperative_count"] > 1:
            return "CRITICAL", 10.0
        
        if features["has_code_block"] and features["sensitive_count"] > 0:
            return "HIGH", 30.0

        # 2. ML-Based Scoring (The "Nuance")
        # Base score starts at 100 (Safe)
        score = 100.0
        
        # Deduct for Toxicity (0.0 to 1.0) -> heavy penalty
        score -= metrics.get("toxicity", 0) * 80 
        
        # Deduct for Bias (0.0 to 1.0) -> medium penalty
        score -= metrics.get("bias", 0) * 40
        
        # Deduct for Sensitive Tokens
        score -= features["sensitive_count"] * 10
        
        # Deduct for Imperatives (if context suggests harm)
        score -= features["imperative_count"] * 5

        # Clamp score
        score = max(0.0, min(100.0, score))
        
        # Map Score to Risk Label
        risk_label = self._map_score_to_label(score)
        
        return risk_label, score

    def _map_score_to_label(self, score):
        if score >= 90: return "SAFE"
        if score >= 75: return "LOW"
        if score >= 50: return "MEDIUM"
        if score >= 25: return "HIGH"
        return "CRITICAL"
