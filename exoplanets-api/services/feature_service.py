import logging
import numpy as np
import pandas as pd
from fastapi import HTTPException
from services.model_service import model_service

logger = logging.getLogger(__name__)

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer features exactly as done during model training"""
    try:
        # Calculate engineered features (same as training pipeline)
        df['koi_insol'] = df['koi_steff']**4 / df['koi_period']**2
        df['period_insol_ratio'] = df['koi_period'] / df['koi_insol']
        df['radius_temp_ratio'] = df['koi_prad'] / df['koi_teq']
        df['log_period'] = np.log10(df['koi_period'])

        # Handle koi_depth safely
        if 'koi_depth' in df.columns:
            df['log_depth'] = np.log10(
                df['koi_depth'].replace(0, 1000))  # Avoid log(0)
        else:
            df['log_depth'] = np.log10(1000)  # Default value

        return df
    except Exception as e:
        logger.error(f"Error in feature engineering: {e}")
        return df

def prepare_for_prediction(data: dict) -> pd.DataFrame:
    """Prepare input data for model prediction with all required features"""
    try:
        # Create DataFrame from input
        input_df = pd.DataFrame([data])

        # Calculate engineered features
        koi_period = data.get('koi_period', 0)
        koi_steff = data.get('koi_steff', 0)
        koi_prad = data.get('koi_prad', 0)
        koi_teq = data.get('koi_teq', 0)
        koi_depth = data.get('koi_depth', 1000)

        # Calculate engineered features
        input_df['koi_insol'] = koi_steff**4 / koi_period**2
        input_df['period_insol_ratio'] = koi_period / input_df['koi_insol']
        input_df['radius_temp_ratio'] = koi_prad / koi_teq
        input_df['log_period'] = np.log10(koi_period)
        input_df['log_depth'] = np.log10(koi_depth)

        # Add mission if missing
        if 'mission' not in input_df.columns:
            input_df['mission'] = data.get('mission', 'TESS')

        # Ensure all expected features are present
        for feature in model_service.expected_features:
            if feature not in input_df.columns:
                input_df[feature] = 0.0

        # Select only the expected features in correct order
        input_df = input_df[model_service.expected_features]

        logger.info(f"🔧 Prepared features: {input_df.columns.tolist()}")
        logger.info(f"📐 Data shape: {input_df.shape}")

        return input_df

    except Exception as e:
        logger.error(f"Error preparing data: {e}")
        raise HTTPException(
            status_code=400, detail=f"Data preparation error: {str(e)}")

def predict_exoplanet(input_data: dict) -> dict:
    """Predict if candidate is an exoplanet using model"""
    try:
        if not model_service.is_loaded():
            raise HTTPException(status_code=500, detail="Model not loaded")

        # Prepare data
        prepared_data = prepare_for_prediction(input_data)

        # Handle missing values
        prepared_data_imputed = pd.DataFrame(
            model_service.imputer.transform(prepared_data),
            columns=prepared_data.columns,
            index=prepared_data.index
        )

        # Scale features
        prepared_data_scaled = model_service.scaler.transform(
            prepared_data_imputed)

        # Predict probability
        probability = model_service.model.predict_proba(
            prepared_data_scaled)[0][1]

        # Use discovery threshold
        is_exoplanet = probability > 0.35

        # Generate details based on prediction
        details = _generate_prediction_details(is_exoplanet, probability)

        return {
            "is_exoplanet": bool(is_exoplanet),
            "confidence": float(probability),
            "details": details,
            "model_type": "Gradient Boosting (Kepler + TESS)",
            "features_used": len(model_service.expected_features)
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Prediction failed: {str(e)}")

def _generate_prediction_details(is_exoplanet: bool, probability: float) -> str:
    """Generate human-readable prediction details"""
    if is_exoplanet:
        if probability > 0.8:
            return "High confidence exoplanet candidate with strong transit signals"
        elif probability > 0.6:
            return "Promising exoplanet candidate with good signal characteristics"
        else:
            return "Potential exoplanet candidate requiring further verification"
    else:
        if probability < 0.1:
            return "Clear false positive with inconsistent transit patterns"
        elif probability < 0.25:
            return "Likely false positive due to stellar variability or noise"
        else:
            return "Borderline case - recommend additional observations"
