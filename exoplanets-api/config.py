import os

class Settings:
    def __init__(self):
        self.ALLOWED_ORIGINS = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174"
        ]
        self.MODEL_PATH = os.getenv("MODEL_PATH", "exoplanet_detector.pkl")
        self.PREDICTION_THRESHOLD = 0.35

# Global settings instance
_settings = None

def get_settings():
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
