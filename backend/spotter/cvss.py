class CVSSCalculator:
    def __init__(self):
        # CVSS 3.1 Base Metrics Constants
        self.metrics = {
            "AV": {"N": 0.85, "A": 0.62, "L": 0.55, "P": 0.2},  # Attack Vector
            "AC": {"L": 0.77, "H": 0.44},                       # Attack Complexity
            "PR": {"N": 0.85, "L": 0.62, "H": 0.27},            # Privileges Required
            "UI": {"N": 0.85, "R": 0.62},                       # User Interaction
            "S":  {"U": 6.42, "C": 7.52},                       # Scope
            "C":  {"N": 0.0, "L": 0.22, "H": 0.56},             # Confidentiality
            "I":  {"N": 0.0, "L": 0.22, "H": 0.56},             # Integrity
            "A":  {"N": 0.0, "L": 0.22, "H": 0.56}              # Availability
        }
        
        # LLM Specific Extensions (Proposed)
        self.llm_metrics = {
            "AO": {"Internal": 1.0, "External": 0.8},          # Attack Origin
            "PM": {"Blackbox": 1.0, "Whitebox": 0.6}            # Provider Model
        }

    def calculate(self, vector_str):
        """
        Calculates the CVSS 3.1 Score from a vector string.
        Example Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
        """
        try:
            # Parse Vector
            parts = vector_str.split('/')
            metric_values = {}
            for part in parts[1:]:
                if ':' in part:
                    key, value = part.split(':')
                    metric_values[key] = value

            # Defaults if missing
            av = metric_values.get("AV", "N")
            ac = metric_values.get("AC", "L")
            pr = metric_values.get("PR", "N")
            ui = metric_values.get("UI", "N")
            s  = metric_values.get("S", "U")
            c  = metric_values.get("C", "N")
            i  = metric_values.get("I", "N")
            a  = metric_values.get("A", "N")

            # Calculate Impact Sub-score (ISS)
            iss = 1 - ((1 - self.metrics["C"][c]) * (1 - self.metrics["I"][i]) * (1 - self.metrics["A"][a]))

            # Calculate Impact
            if s == "U":
                impact = 6.42 * iss
            else:
                impact = 7.52 * (iss - 0.029) - 3.25 * ((iss - 0.02)**15)

            # Calculate Exploitability
            exploitability = 8.22 * self.metrics["AV"][av] * self.metrics["AC"][ac] * self.metrics["PR"][pr] * self.metrics["UI"][ui]

            # Calculate Base Score
            if impact <= 0:
                base_score = 0
            else:
                if s == "U":
                    base_score = min((impact + exploitability), 10)
                else:
                    base_score = min(1.08 * (impact + exploitability), 10)

            # Round up to 1 decimal
            import math
            base_score = math.ceil(base_score * 10) / 10.0
            
            return base_score

        except Exception as e:
            print(f"CVSS Calculation Error: {e}")
            return 0.0

    def generate_vector(self, risk, category):
        """
        Generates a CVSS vector based on the risk level and category.
        """
        # Default Baseline: Network, Low Complexity, No Privs, No UI, Unchanged Scope
        vector = "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U"
        
        c, i, a = "N", "N", "N"
        
        if risk == "CRITICAL":
            c, i, a = "H", "H", "H"
        elif risk == "HIGH":
            c, i, a = "H", "H", "L"
        elif risk == "MEDIUM":
            c, i, a = "L", "L", "L"
            
        # Category Specific Adjustments
        if category == "PII/Privacy":
            c = "H"
        elif category in ["Malware/Hacking", "Prompt Injection"]:
            i = "H"
        elif category in ["Violence", "Self-Harm", "Hate Speech/Toxicity"]:
            i = "H" # Content Safety mapped to Integrity
            
        return f"{vector}/C:{c}/I:{i}/A:{a}"
