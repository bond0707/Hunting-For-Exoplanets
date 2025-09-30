from typing import List
from schemas import ExoplanetData, PredictionResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
import numpy as np
import pandas as pd
import joblib
import warnings
import json

warnings.filterwarnings("ignore", category=UserWarning)

app = FastAPI(
    title="KeplerAI Exoplanet API",
    description="API for classifying exoplanet candidates using Gradient Boosting model trained on Kepler data.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    # Load your Gradient Boosting model
    model_assets = joblib.load("exoplanet_gradient_boosting.pkl")
    gb_model = model_assets['model']
    scaler = model_assets['scaler']
    available_features = model_assets['features']
    imputer = model_assets['imputer']
    
    # Use your balanced threshold
    threshold = 0.35
    print("✅ Gradient Boosting model loaded successfully!")
    print(f"🎯 Using {len(available_features)} features: {available_features}")
    
except FileNotFoundError:
    print("🛑 Error: 'discovery_gradient_boosting_model.pkl' not found.")
    gb_model = None
    scaler = None
    available_features = None
    imputer = None
    threshold = None

def get_prediction(data: ExoplanetData):
    if not gb_model or not threshold:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    print(f"🔧 Processing prediction with available features: {available_features}")

    # Convert to DataFrame
    input_df = pd.DataFrame([data.dict()])
    
    # Create engineered features from base features
    try:
        # These are the engineered features your model expects
        input_df['koi_insol'] = input_df['koi_steff']**4 / input_df['koi_period']**2
        input_df['period_insol_ratio'] = input_df['koi_period'] / input_df['koi_insol']
        input_df['radius_temp_ratio'] = input_df['koi_prad'] / input_df['koi_teq']
        input_df['log_period'] = np.log10(input_df['koi_period'])
        
        # Handle koi_slogg if it's in your features but not from frontend
        if 'koi_slogg' in available_features and 'koi_slogg' not in input_df.columns:
            # Provide a default value or calculate if possible
            input_df['koi_slogg'] = 4.5  # Default stellar gravity
        
        print(f"🔧 Engineered features created successfully")
        print(f"🔧 Available columns after engineering: {input_df.columns.tolist()}")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Feature engineering error: {str(e)}")

    # Check if we have all required features after engineering
    missing_features = set(available_features) - set(input_df.columns)
    if missing_features:
        raise HTTPException(
            status_code=400, 
            detail=f"Missing features after engineering: {missing_features}. Available: {input_df.columns.tolist()}"
        )

    # Handle missing values
    try:
        # Only use the features that exist in both sets
        features_to_impute = [f for f in available_features if f in input_df.columns]
        input_df[features_to_impute] = imputer.transform(input_df[features_to_impute])
        print(f"🔧 Missing values imputed for {len(features_to_impute)} features")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Feature processing error: {str(e)}")
    
    # Scale features
    try:
        X_scaled = scaler.transform(input_df[available_features])
        print(f"🔧 Features scaled successfully")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Feature scaling error: {str(e)}")

    try:
        probability = gb_model.predict_proba(X_scaled)[:, 1][0]
        print(f"🎯 Prediction probability: {probability}")
    except Exception as e:
        return {"error": f"Prediction error: {str(e)}"}

    is_exoplanet = bool(probability >= threshold)
    confidence_score = probability if is_exoplanet else 1 - probability

    # Enhanced messaging
    if is_exoplanet:
        if confidence_score > 0.90:
            detail_message = "Very strong exoplanet candidate - high confidence"
        elif confidence_score > 0.75:
            detail_message = "Strong exoplanet candidate"
        elif confidence_score > 0.60:
            detail_message = "Promising exoplanet candidate"
        else:
            detail_message = "Weak exoplanet candidate - requires verification"
    else:
        if confidence_score > 0.90:
            detail_message = "Very likely not an exoplanet"
        elif confidence_score > 0.75:
            detail_message = "Likely not an exoplanet"
        else:
            detail_message = "Unclear - borderline case"

    return {
        "is_exoplanet": is_exoplanet,
        "confidence": confidence_score,
        "details": detail_message,
        "threshold_used": threshold,
        "model_type": "GradientBoosting"
    }
    
# Add this diagnostic endpoint to your main.py
@app.get("/debug/model-features")
def debug_model_features():
    if not available_features:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    base_features = ["koi_period", "koi_depth", "koi_prad", "koi_duration", 
                    "koi_srad", "koi_steff", "koi_teq", "mission"]
    
    engineered_features = set(available_features) - set(base_features)
    
    return {
        "all_features": available_features,
        "base_features": base_features,
        "engineered_features": list(engineered_features),
        "feature_count": len(available_features)
    }

@app.get("/model/analytics")
def get_model_analytics():
    try:
        with open("model_analytics.json", "r") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        raise HTTPException(
            status_code=404, detail="Model analytics file not found.")

@app.get("/")
def read_root():
    return {
        "status": "ok", 
        "message": "Welcome to the KeplerAI Exoplanet API!",
        "model": "Gradient Boosting (Kepler Dataset)",
        "strategy": "Balanced Discovery",
        "threshold": 0.35
    }

@app.get("/model/info")
def get_model_info():
    """Get information about the loaded model"""
    if not gb_model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_type": "GradientBoosting",
        "strategy": "Balanced Discovery",
        "threshold": threshold,
        "features_used": available_features,
        "feature_count": len(available_features) if available_features else 0,
        "performance": {
            "expected_recall": 0.921,
            "expected_precision": 0.853,
            "expected_f1": 0.886
        }
    }

@app.post("/analyze", response_model=PredictionResponse)
def analyze_candidate(data: ExoplanetData):
    print("📨 Received data:", data.dict())  # ADD THIS LINE
    result = get_prediction(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/batch-analyze")
def batch_analyze_candidates(candidates: List[ExoplanetData]):
    results = []
    for candidate_data in candidates:
        prediction = get_prediction(candidate_data)
        # Combine input data with prediction results
        candidate_dict = candidate_data.dict()
        candidate_dict.update(prediction)
        results.append(candidate_dict)
    return results

@app.get("/features")
def get_feature_descriptions():
    """Get descriptions of the features used by the model"""
    feature_descriptions = {
        "koi_period": "Orbital period in days",
        "koi_depth": "Transit depth in parts per million (ppm)", 
        "koi_prad": "Planet radius in Earth radii",
        "koi_duration": "Transit duration in hours",
        "koi_srad": "Stellar radius in Solar radii",
        "koi_steff": "Stellar effective temperature in Kelvin",
        "koi_teq": "Planet equilibrium temperature in Kelvin",
        "koi_insol": "Insolation flux relative to Earth",
        "period_insol_ratio": "Ratio of orbital period to insolation flux",
        "radius_temp_ratio": "Ratio of planet radius to equilibrium temperature",
        "log_period": "Logarithm of orbital period"
    }
    return feature_descriptions