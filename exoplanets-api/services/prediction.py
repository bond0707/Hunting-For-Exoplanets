# services/prediction.py

import os
import json
import joblib
import logging
import numpy as np

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

def _perform_sanity_checks(mapped_data: dict) -> tuple:
    """
    Internal function to perform physical sanity checks.
    Returns: (is_valid, confidence_penalty, warning_message)
    """
    confidence_penalty = 0.0
    warning_message = ""
    
    # Extract key features
    period = mapped_data.get('period', 0)
    planet_radius = mapped_data.get('planet_radius', 0)
    planet_temp = mapped_data.get('planet_temp', 0)
    stellar_radius = mapped_data.get('stellar_radius', 0)
    stellar_temp = mapped_data.get('stellar_temp', 0)
    
    # Check for physically impossible values
    if period <= 0 or planet_radius <= 0 or stellar_radius <= 0:
        return False, 1.0, "Physically impossible values detected"
    
    # Check extreme values
    if planet_radius > 50:  # Jupiter radius ~11, so >50 is extreme
        confidence_penalty += 0.3
        warning_message += "Extremely large planet radius. "
    
    if period > 1000:  # Very long orbital period
        confidence_penalty += 0.2
        warning_message += "Extremely long orbital period. "
    
    if planet_temp > 5000:  # Unrealistically hot
        confidence_penalty += 0.3
        warning_message += "Extremely high planet temperature. "
    
    # Check consistency
    if planet_radius > stellar_radius * 2:  # Planet larger than star
        confidence_penalty += 0.4
        warning_message += "Planet appears larger than host star. "
    
    return True, confidence_penalty, warning_message.strip()

def _safe_model_prediction(model, input_features, model_name="unknown"):
    """
    Safely get model prediction with error handling.
    """
    try:
        return model.predict_proba([input_features])[0][1]
    except Exception as e:
        logger.warning(f"⚠️ {model_name} prediction failed: {e}")
        return 0.5  # Neutral fallback

def _calibrate_confidence(raw_confidence: float, mission: str, sanity_penalty: float = 0.0) -> float:
    """
    Calibrate confidence based on mission and sanity checks.
    """
    calibrated = max(0.0, raw_confidence - sanity_penalty)
    
    # Mission-specific adjustments
    mission_adjustments = {
        'kepler': 0.02,    # Well-established mission
        'tess': -0.05,     # Newer mission, more uncertainty
        'k2': -0.02,       # Intermediate confidence
    }
    
    calibrated += mission_adjustments.get(mission.lower(), 0.0)
    return max(0.0, min(1.0, calibrated))

def _generate_candidate_details(confidence: float, is_exoplanet: bool, mission: str) -> str:
    """
    Generate detailed candidate classification without showing notes in the table.
    """
    if not is_exoplanet:
        if confidence < 0.1:
            return "Clear false positive"
        elif confidence < 0.2:
            return "Highly likely false positive"
        elif confidence < 0.3:
            return "Probable false positive"
        else:
            return "Possible false positive - requires verification"
    
    # Exoplanet candidates
    if confidence >= 0.9:
        return "Exceptional exoplanet candidate"
    elif confidence >= 0.8:
        return "High confidence exoplanet candidate"
    elif confidence >= 0.7:
        return "Strong exoplanet candidate"
    elif confidence >= 0.6:
        return "Promising exoplanet candidate"
    elif confidence >= 0.5:
        return "Moderate confidence candidate"
    elif confidence >= 0.4:
        return "Potential candidate - needs confirmation"
    else:  # 0.35-0.4 range (just above threshold)
        if mission.lower() == 'tess':
            return "Borderline candidate - TESS data suggests verification"
        elif mission.lower() == 'k2':
            return "Borderline candidate - K2 data suggests further study"
        else:
            return "Borderline candidate - requires additional evidence"

def perform_analysis(mission: str, data: SingleAnalysisData) -> AnalysisResponse:
    """
    Performs exoplanet analysis using a 5-model ensemble.
    """
    input_data = data.model_dump(exclude_unset=True)

    # Map frontend names to backend names and create derived features
    mapped_data = {FRONTEND_TO_BACKEND_MAP.get(k, k): v for k, v in input_data.items()}
    epsilon = 1e-6
    mapped_data['depth_over_duration'] = (mapped_data.get('koi_depth', 0.0)) / ((mapped_data.get('koi_duration', 0.0)) + epsilon)
    mapped_data['radius_over_period'] = (mapped_data.get('planet_radius', 0.0)) / ((mapped_data.get('period', 0.0)) + epsilon)

    # Perform sanity checks
    is_valid, sanity_penalty, sanity_warning = _perform_sanity_checks(mapped_data)
    
    if not is_valid:
        return AnalysisResponse(
            is_exoplanet=False,
            confidence=0.01,
            details="Invalid input parameters",
            model_type="Sanity Check",
            mission=mission
        )

    # Get predictions from each specialist model with error handling
    kepler_input = [mapped_data.get(f, 0.0) for f in KEPLER_FEATURES]
    kepler_pred = _safe_model_prediction(MODELS['kepler_specialist'], kepler_input, "Kepler Specialist")

    tess_input = [mapped_data.get(f, 0.0) for f in TESS_FEATURES]
    tess_pred = _safe_model_prediction(MODELS['tess_specialist'], tess_input, "TESS Specialist")

    k2_input = [mapped_data.get(f, 0.0) for f in K2_FEATURES]
    k2_pred = _safe_model_prediction(MODELS['k2_specialist'], k2_input, "K2 Specialist")

    universal_input = [mapped_data.get(f, 0.0) for f in UNIVERSAL_FEATURES]
    universal_pred = _safe_model_prediction(MODELS['universal_finder'], universal_input, "Universal Finder")
    fake_detector_pred = _safe_model_prediction(MODELS['fake_detector'], universal_input, "Fake Detector")

    # Combine predictions with the meta-model
    predictions = [kepler_pred, tess_pred, k2_pred, universal_pred, fake_detector_pred]
    
    try:
        final_confidence = MODELS['meta_model'].predict_proba([predictions])[0][1]
    except Exception as e:
        logger.warning(f"⚠️ Meta-model prediction failed, using weighted average: {e}")
        # Fallback: weighted average of specialist predictions
        weights = [0.25, 0.20, 0.20, 0.20, 0.15]  # Kepler has highest weight
        final_confidence = sum(p * w for p, w in zip(predictions, weights))

    # Apply confidence calibration
    calibrated_confidence = _calibrate_confidence(final_confidence, mission, sanity_penalty)

    # Dynamic threshold based on mission
    threshold = 0.35  # Base threshold
    if mission.lower() == 'kepler':
        threshold = 0.30  # Kepler has better data quality
    elif mission.lower() == 'tess':
        threshold = 0.40  # TESS has more false positives

    is_exoplanet = calibrated_confidence > threshold
    
    # Generate clean details without notes for table display
    details = _generate_candidate_details(calibrated_confidence, is_exoplanet, mission)

    return AnalysisResponse(
        is_exoplanet=is_exoplanet,
        confidence=calibrated_confidence,
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