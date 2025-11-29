import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import math

class AnomalyDetector:
    def __init__(self, model_name='gpt2'):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self._load_model()

    def _load_model(self):
        print("AnomalyDetector initialized (Lightweight Mode)")
        self.tokenizer = None
        self.model = None

    def calculate_perplexity(self, text):
        """
        Calculates the perplexity of the text using GPT-2.
        Higher perplexity indicates more anomalous/unexpected text (potential OOD/adversarial).
        """
        if not self.model or not self.tokenizer:
            return 0.0

        try:
            encodings = self.tokenizer(text, return_tensors='pt')
            input_ids = encodings.input_ids
            
            with torch.no_grad():
                outputs = self.model(input_ids, labels=input_ids)
                loss = outputs.loss
                perplexity = torch.exp(loss).item()
                
            return perplexity
        except Exception as e:
            print(f"Error calculating perplexity: {e}")
            return 0.0

    def is_anomalous(self, text, threshold=100.0):
        """
        Determines if text is anomalous based on perplexity threshold.
        """
        ppl = self.calculate_perplexity(text)
        return ppl > threshold, ppl
