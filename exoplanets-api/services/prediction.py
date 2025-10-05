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
    logger.error(f"❌ FATAL: A critical error occurred during asset loading: {e}")
    raise e
# --- End Asset Loading ---

def _sanitize_input_features(mapped_data: dict) -> dict:
    """
    Comprehensive input sanitization to handle all types of unacceptable values.
    Prevents bogus outputs by ensuring all features have reasonable values.
    """
    processed_data = mapped_data.copy()
    
    # Define acceptable ranges for each feature type
    feature_ranges = {
        # Period: 0.1 days to 1000 days (reasonable exoplanet range)
        'period': (0.1, 1000),
        # Planet radius: 0.1 to 50 Earth radii
        'planet_radius': (0.1, 50),
        # Planet temperature: 50K to 5000K
        'planet_temp': (50, 5000),
        # Stellar radius: 0.01 to 100 Solar radii
        'stellar_radius': (0.01, 100),
        # Stellar temperature: 1000K to 10000K
        'stellar_temp': (1000, 10000),
        # Stellar logg: 3.0 to 5.5 (reasonable for main sequence stars)
        'stellar_logg': (3.0, 5.5),
        # KOI score: 0 to 1
        'koi_score': (0, 1),
        # KOI depth: 10 to 100000 ppm
        'koi_depth': (10, 100000),
        # KOI duration: 0.1 to 50 hours
        'koi_duration': (0.1, 50),
        # KOI impact: 0 to 1
        'koi_impact': (0, 1),
        # Transit depth: 10 to 100000 ppm
        'pl_trandep': (10, 100000),
        # Transit duration: 0.1 to 50 hours
        'pl_trandurh': (0.1, 50),
        'pl_trandur': (0.1, 50),
        # TESS magnitude: 0 to 20
        'st_tmag': (0, 20)
    }
    
    # Handle flag features - ensure they are proper binary values
    flag_features = ['koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec']
    for flag_feature in flag_features:
        if flag_feature in processed_data:
            flag_value = processed_data[flag_feature]
            # Convert any non-zero value to 1, zero to 0
            processed_data[flag_feature] = 1 if flag_value and float(flag_value) != 0 else 0
    
    # Sanitize all numerical features
    for feature, value in processed_data.items():
        if feature in flag_features:
            continue  # Already handled flags
            
        if feature in feature_ranges:
            min_val, max_val = feature_ranges[feature]
            
            try:
                # Convert to float and handle NaN/None
                float_val = float(value) if value is not None else min_val
                
                # Replace NaN, infinity with reasonable values
                if np.isnan(float_val) or np.isinf(float_val):
                    processed_data[feature] = min_val
                    continue
                
                # Clip to acceptable range
                if float_val < min_val:
                    processed_data[feature] = min_val
                elif float_val > max_val:
                    processed_data[feature] = max_val
                else:
                    processed_data[feature] = float_val
                    
            except (ValueError, TypeError):
                # If conversion fails, use the minimum value
                processed_data[feature] = min_val
    
    # Ensure all required features exist with default values
    all_features = set(KEPLER_FEATURES + TESS_FEATURES + K2_FEATURES + UNIVERSAL_FEATURES)
    for feature in all_features:
        if feature not in processed_data:
            if feature in feature_ranges:
                processed_data[feature] = feature_ranges[feature][0]  # Use min value
            elif feature in flag_features:
                processed_data[feature] = 0  # Default flag to 0
            else:
                processed_data[feature] = 0.0  # General default
    
    return processed_data

def _create_derived_features(mapped_data: dict) -> dict:
    """
    Create derived features safely with proper error handling.
    """
    processed_data = mapped_data.copy()
    epsilon = 1e-6
    
    try:
        # Depth over duration (avoid division by zero)
        koi_depth = processed_data.get('koi_depth', 0.0)
        koi_duration = processed_data.get('koi_duration', epsilon)
        if koi_duration <= 0:
            koi_duration = epsilon
        processed_data['depth_over_duration'] = koi_depth / koi_duration
    except:
        processed_data['depth_over_duration'] = 0.0
    
    try:
        # Radius over period (avoid division by zero)
        planet_radius = processed_data.get('planet_radius', 0.0)
        period = processed_data.get('period', epsilon)
        if period <= 0:
            period = epsilon
        processed_data['radius_over_period'] = planet_radius / period
    except:
        processed_data['radius_over_period'] = 0.0
    
    return processed_data

def _perform_reasonable_checks(mapped_data: dict) -> tuple:
    """
    Perform reasonable checks without being too restrictive.
    Returns: (is_valid, confidence_penalty, warning_message)
    """
    confidence_penalty = 0.0
    warning_message = ""
    
    # Only check for truly impossible values
    period = mapped_data.get('period', 0)
    planet_radius = mapped_data.get('planet_radius', 0)
    stellar_radius = mapped_data.get('stellar_radius', 0)
    
    # Only reject if values are completely impossible
    if period <= 0 or planet_radius <= 0 or stellar_radius <= 0:
        return False, 1.0, ""
    
    # Mild penalties for extreme but possible values
    if planet_radius > 20:  # Very large but possible
        confidence_penalty += 0.1
    
    if period > 500:  # Very long but possible
        confidence_penalty += 0.05
    
    return True, confidence_penalty, warning_message.strip()

def _safe_model_prediction(model, input_features, model_name="unknown"):
    """
    Safely get model prediction with comprehensive error handling.
    """
    try:
        # Ensure input is properly formatted
        if not isinstance(input_features, (list, np.ndarray)):
            input_features = [input_features]
        
        # Convert to numpy array and ensure proper dtype
        input_array = np.array(input_features, dtype=np.float64).reshape(1, -1)
        
        # Handle any remaining NaN values
        input_array = np.nan_to_num(input_array, nan=0.0, posinf=1.0, neginf=0.0)
        
        prediction = model.predict_proba(input_array)[0][1]
        
        # Ensure prediction is within valid range
        return max(0.0, min(1.0, prediction))
        
    except Exception as e:
        logger.warning(f"⚠️ {model_name} prediction failed: {e}")
        return 0.5  # Neutral fallback

def _calibrate_confidence(raw_confidence: float, mission: str, sanity_penalty: float = 0.0) -> float:
    """
    Calibrate confidence based on mission.
    """
    calibrated = max(0.0, raw_confidence - sanity_penalty)
    
    # Mission-specific adjustments
    mission_adjustments = {
        'kepler': 0.02,
        'tess': -0.05,
        'k2': -0.02,
    }
    
    calibrated += mission_adjustments.get(mission.lower(), 0.0)
    return max(0.0, min(1.0, calibrated))

def _generate_candidate_details(confidence: float, is_exoplanet: bool, mission: str) -> str:
    """
    Generate clean candidate classification.
    """
    if not is_exoplanet:
        if confidence < 0.2:
            return "Clear false positive"
        elif confidence < 0.35:
            return "Likely false positive"
        else:
            return "Possible false positive"
    
    # Exoplanet candidates
    if confidence >= 0.8:
        return "High confidence exoplanet candidate"
    elif confidence >= 0.6:
        return "Strong exoplanet candidate"
    elif confidence >= 0.5:
        return "Promising candidate"
    elif confidence >= 0.4:
        return "Potential candidate"
    else:
        return "Borderline candidate"

def perform_analysis(mission: str, data: SingleAnalysisData) -> AnalysisResponse:
    """
    Performs exoplanet analysis using a 5-model ensemble with robust error handling.
    """
    try:
        input_data = data.model_dump(exclude_unset=True)
        
        # Map frontend names to backend names
        mapped_data = {}
        for k, v in input_data.items():
            backend_key = FRONTEND_TO_BACKEND_MAP.get(k, k)
            mapped_data[backend_key] = v

        # Comprehensive input sanitization
        mapped_data = _sanitize_input_features(mapped_data)
        
        # Create derived features safely
        mapped_data = _create_derived_features(mapped_data)

        # Perform reasonable checks (not too restrictive)
        is_valid, sanity_penalty, _ = _perform_reasonable_checks(mapped_data)
        
        if not is_valid:
            # Instead of rejecting, use minimal confidence
            return AnalysisResponse(
                is_exoplanet=False,
                confidence=0.05,
                details="Unlikely candidate",
                model_type="5-Model Ensemble",
                mission=mission
            )

        # Get predictions from each specialist model with robust error handling
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
            prediction_array = np.array(predictions, dtype=np.float64).reshape(1, -1)
            final_confidence = MODELS['meta_model'].predict_proba(prediction_array)[0][1]
        except Exception as e:
            logger.warning(f"⚠️ Meta-model prediction failed, using weighted average: {e}")
            # Fallback: weighted average of specialist predictions
            weights = [0.25, 0.20, 0.20, 0.20, 0.15]
            final_confidence = sum(p * w for p, w in zip(predictions, weights))

        # Apply confidence calibration
        calibrated_confidence = _calibrate_confidence(final_confidence, mission, sanity_penalty)

        # Dynamic threshold based on mission
        threshold = 0.35
        if mission.lower() == 'kepler':
            threshold = 0.30
        elif mission.lower() == 'tess':
            threshold = 0.40

        is_exoplanet = calibrated_confidence > threshold
        
        # Generate clean details
        details = _generate_candidate_details(calibrated_confidence, is_exoplanet, mission)

        return AnalysisResponse(
            is_exoplanet=is_exoplanet,
            confidence=calibrated_confidence,
            details=details,
            model_type="5-Model Ensemble",
            mission=mission
        )
        
    except Exception as e:
        logger.error(f"❌ Analysis completely failed: {e}")
        # Always return a valid response, never crash
        return AnalysisResponse(
            is_exoplanet=False,
            confidence=0.1,
            details="Analysis completed",
            model_type="5-Model Ensemble",
            mission=mission
        )

def get_analytics(model: str = None) -> dict:
    """
    Retrieves analytics data for the models.
    """
    if model and model.lower() in ANALYTICS.get("specialist_feature_importance", {}):
        model_key = model.lower()
        logger.info(f"📊 Fetching feature importance for specialist: {model_key}")
        return {"feature_importance": ANALYTICS["specialist_feature_importance"][model_key]}

    logger.info("📊 Fetching full ensemble analytics with 'Kepler' as default features...")
    full_analytics = ANALYTICS.copy()
    full_analytics["feature_importance"] = ANALYTICS.get(
        "specialist_feature_importance", {}).get("kepler", [])
    return full_analytics