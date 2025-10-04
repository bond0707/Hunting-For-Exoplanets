# services/prediction.py

import os
import json
import joblib
import logging

from schemas import SingleAnalysisData, AnalysisResponse
from config import (
    KEPLER_FEATURES, TESS_FEATURES, K2_FEATURES, UNIVERSAL_FEATURES,
    FRONTEND_TO_BACKEND_MAP
)

logger = logging.getLogger(__name__)

# --- Asset Loading ---
# This section loads all models and analytics data into memory on startup.
# By placing it at the module level, it runs only once when the service is imported.
MODELS = {}
ANALYTICS = {}
try:
    logger.info("🚀 Verifying and loading all assets...")
    required_files = {
        "kepler_specialist": 'models/kepler_specialist_tuned.pkl',
        "tess_specialist": 'models/tess_specialist_tuned.pkl',
        "k2_specialist": 'models/k2_specialist_tuned.pkl',
        "universal_finder": 'models/universal_planet_finder_tuned.pkl',
        "fake_detector": 'models/fake_detector_specialist_tuned.pkl',
        "meta_model": 'models/meta_model_final.pkl',
        "analytics_data": 'model_analytics.json'
    }
    for name, path in required_files.items():
        if not os.path.exists(path):
            raise FileNotFoundError(f"Missing required file: {path}")

    for model_name, path in required_files.items():
        if model_name == "analytics_data":
            with open(path, 'r') as f:
                ANALYTICS = json.load(f)
        else:
            MODELS[model_name] = joblib.load(path)
    logger.info("✅ All assets loaded successfully.")
except Exception as e:
    logger.error(
        f"❌ FATAL: A critical error occurred during asset loading: {e}")
    raise e
# --- End Asset Loading ---


def perform_analysis(mission: str, data: SingleAnalysisData) -> AnalysisResponse:
    """
    Performs exoplanet analysis using a 5-model ensemble.
    """
    input_data = data.model_dump(exclude_unset=True)

    # Map frontend names to backend names and create derived features
    mapped_data = {FRONTEND_TO_BACKEND_MAP.get(
        k, k): v for k, v in input_data.items()}
    epsilon = 1e-6
    mapped_data['depth_over_duration'] = (mapped_data.get(
        'koi_depth', 0.0)) / ((mapped_data.get('koi_duration', 0.0)) + epsilon)
    mapped_data['radius_over_period'] = (mapped_data.get(
        'planet_radius', 0.0)) / ((mapped_data.get('period', 0.0)) + epsilon)

    # Get predictions from each specialist model
    kepler_input = [mapped_data.get(f, 0.0) for f in KEPLER_FEATURES]
    kepler_pred = MODELS['kepler_specialist'].predict_proba([kepler_input])[
        0][1]

    tess_input = [mapped_data.get(f, 0.0) for f in TESS_FEATURES]
    tess_pred = MODELS['tess_specialist'].predict_proba([tess_input])[0][1]

    k2_input = [mapped_data.get(f, 0.0) for f in K2_FEATURES]
    k2_pred = MODELS['k2_specialist'].predict_proba([k2_input])[0][1]

    universal_input = [mapped_data.get(f, 0.0) for f in UNIVERSAL_FEATURES]
    universal_pred = MODELS['universal_finder'].predict_proba([universal_input])[
        0][1]
    fake_detector_pred = MODELS['fake_detector'].predict_proba([universal_input])[
        0][1]

    # Combine predictions with the meta-model
    predictions = [kepler_pred, tess_pred, k2_pred,
                   universal_pred, fake_detector_pred]
    final_confidence = MODELS['meta_model'].predict_proba([predictions])[0][1]

    is_exoplanet = final_confidence > 0.35
    details = "High confidence candidate." if final_confidence > 0.8 else "Potential candidate."

    return AnalysisResponse(
        is_exoplanet=is_exoplanet,
        confidence=final_confidence,
        details=details,
        model_type="5-Model Ensemble",
        mission=mission
    )


def get_analytics(model: str = None) -> dict:
    """
    Retrieves analytics data for the models.
    """
    if model and model.lower() in ANALYTICS.get("specialist_feature_importance", {}):
        model_key = model.lower()
        logger.info(
            f"📊 Fetching feature importance for specialist: {model_key}")
        return {"feature_importance": ANALYTICS["specialist_feature_importance"][model_key]}

    logger.info(
        "📊 Fetching full ensemble analytics with 'Kepler' as default features...")
    full_analytics = ANALYTICS.copy()
    full_analytics["feature_importance"] = ANALYTICS.get(
        "specialist_feature_importance", {}).get("kepler", [])
    return full_analytics
