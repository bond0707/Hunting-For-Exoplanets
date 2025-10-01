import joblib
import logging
from config import get_settings

logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.imputer = None
        self.expected_features = []
        self.load_model()

    def load_model(self):
        """Load the model and preprocessing objects"""
        try:
            settings = get_settings()
            model_assets = joblib.load(settings.MODEL_PATH)

            self.model = model_assets['model']
            self.scaler = model_assets['scaler']
            self.imputer = model_assets['imputer']
            self.expected_features = model_assets['features']

            logger.info("✅ Model loaded successfully")
            logger.info(f"📊 Model features: {self.expected_features}")

        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            raise RuntimeError(f"Model loading failed: {e}")

    def is_loaded(self):
        """Check if model is loaded"""
        return self.model is not None

    def get_model_info(self):
        """Get model information"""
        return {
            "model_type": "Gradient Boosting",
            "features_used": len(self.expected_features),
            "dataset_size": 9564,
            "test_set_size": 1034,
            "missions": "Kepler + TESS Combined",
            "training_data": "9,564 astronomical observations"
        }

# Global model service instance
model_service = ModelService()
