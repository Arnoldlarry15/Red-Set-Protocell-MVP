class RemediationEngine:
    def __init__(self):
        # Mapping ALERT Categories to MITRE ATT&CK for LLMs
        # Using the ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems) matrix where possible
        self.mitre_mapping = {
            "Prompt Injection": {
                "id": "AML.T0051", 
                "name": "LLM Prompt Injection",
                "url": "https://atlas.mitre.org/techniques/AML.T0051"
            },
            "Jailbreak": {
                "id": "AML.T0054",
                "name": "LLM Jailbreak",
                "url": "https://atlas.mitre.org/techniques/AML.T0054"
            },
            "PII/Privacy": {
                "id": "AML.T0024",
                "name": "Exfiltration via ML Inference",
                "url": "https://atlas.mitre.org/techniques/AML.T0024"
            },
            "Insecure Output Handling": {
                "id": "AML.T0055", # Hypothetical/Proposed ID for Output Handling
                "name": "Insecure Output Handling",
                "url": "https://owasp.org/www-project-top-10-for-large-language-model-applications/LLM02_Insecure_Output_Handling.html"
            },
            "Hate Speech/Toxicity": {
                "id": "AML.T0056", # Hypothetical
                "name": "Content Safety Violation",
                "url": "https://atlas.mitre.org/"
            },
            "Malware/Hacking": {
                "id": "AML.T0043",
                "name": "Craft Adversarial Data",
                "url": "https://atlas.mitre.org/techniques/AML.T0043"
            }
        }

        self.remediation_steps = {
            "Prompt Injection": [
                "Implement 'Instruction Hierarchy': Explicitly separate system instructions from user data.",
                "Use 'ChatML' or similar structured formats to delimit user input.",
                "Implement a pre-flight 'Spotter' filter to detect adversarial patterns before they reach the model."
            ],
            "Jailbreak": [
                "Fine-tune the model on adversarial examples (adversarial training).",
                "Implement output filtering to catch successful jailbreaks even if the model generates them.",
                "Monitor for high-perplexity or anomalous input patterns."
            ],
            "PII/Privacy": [
                "Implement a Data Loss Prevention (DLP) layer on the output.",
                "Use Named Entity Recognition (NER) to scrub PII before logging or displaying response.",
                "Ensure training data is sanitized of PII."
            ],
            "Insecure Output Handling": [
                "Treat all LLM output as untrusted user input.",
                "Encode/Escape output before rendering in HTML/JS contexts.",
                "Avoid using LLM output directly in system shell commands or SQL queries."
            ],
            "Hate Speech/Toxicity": [
                "Adjust the model's safety settings (e.g., moderation API thresholds).",
                "Implement a post-generation toxicity filter (e.g., Llama Guard, Azure Content Safety).",
                "Update the system prompt to explicitly forbid this type of content."
            ]
        }

    def get_remediation(self, category):
        """
        Returns the MITRE ID, Name, and Remediation Steps for a given category.
        """
        # Normalize category
        if "Injection" in category: category = "Prompt Injection"
        if "Jailbreak" in category: category = "Jailbreak"
        
        mitre = self.mitre_mapping.get(category, {
            "id": "TBD", "name": "General Safety Violation", "url": "#"
        })
        
        steps = self.remediation_steps.get(category, [
            "Review the system prompt.",
            "Analyze the input for adversarial patterns.",
            "Consider adding a safety filtering layer."
        ])
        
        return {
            "mitre_id": mitre["id"],
            "mitre_name": mitre["name"],
            "mitre_url": mitre["url"],
            "steps": steps
        }
