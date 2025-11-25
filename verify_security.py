import unittest
import os
import json
import re
from backend.app import app
from backend.spotter.sanitizer import LogSanitizer

class TestSecurity(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.sanitizer = LogSanitizer()

    def test_api_key_validation(self):
        print("\n[TEST] Verifying API Key Validation...")
        # Test invalid key format
        response = self.app.post('/api/start', json={
            "api_key": "invalid_key",
            "prompt": "test"
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid API Key format", response.get_json()["error"])
        print("  -> Invalid key rejected.")

        # Test valid key format (mock)
        # We expect it to proceed to "queued" or fail later if key is invalid for OpenAI, 
        # but here we test the regex check in app.py
        valid_key = "sk-" + "a" * 48
        response = self.app.post('/api/start', json={
            "api_key": valid_key,
            "prompt": "test"
        })
        # It might fail if DB is locked or other reasons, but shouldn't be 400 Invalid Format
        if response.status_code == 400:
             self.assertNotIn("Invalid API Key format", response.get_json()["error"])
        print("  -> Valid key format accepted (regex check passed).")

    def test_system_key_fallback(self):
        print("\n[TEST] Verifying System Key Fallback...")
        # Mock env var
        os.environ["OPENAI_API_KEY"] = "sk-" + "b" * 48
        
        # Request without key
        response = self.app.post('/api/start', json={
            "prompt": "test"
        })
        
        # Should not be 400 "API Key is required"
        if response.status_code == 400:
            error = response.get_json()["error"]
            self.assertNotEqual(error, "API Key is required (User or System)")
            
        print("  -> System key used when user key missing.")
        
        # Clean up
        del os.environ["OPENAI_API_KEY"]

    def test_log_sanitization(self):
        print("\n[TEST] Verifying Log Sanitization...")
        sensitive_text = "My key is sk-1234567890abcdef12345678 and email is test@example.com"
        sanitized = self.sanitizer.sanitize(sensitive_text)
        
        self.assertNotIn("sk-12345", sanitized)
        self.assertNotIn("test@example.com", sanitized)
        self.assertIn("[REDACTED_API_KEY]", sanitized)
        self.assertIn("[REDACTED_EMAIL]", sanitized)
        print(f"  -> Sanitized: {sanitized}")

    def test_config_endpoint(self):
        print("\n[TEST] Verifying Config Endpoint...")
        # No env key
        if "OPENAI_API_KEY" in os.environ: del os.environ["OPENAI_API_KEY"]
        res = self.app.get('/api/config')
        self.assertFalse(res.get_json()["has_system_key"])
        
        # With env key
        os.environ["OPENAI_API_KEY"] = "sk-test"
        res = self.app.get('/api/config')
        self.assertTrue(res.get_json()["has_system_key"])
        print("  -> Config endpoint correctly reports system key status.")

if __name__ == '__main__':
    unittest.main()
