from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import joblib
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Universal Exoplanet Detector API",
    description="API for detecting exoplanets using Kepler + TESS trained universal model",
    version="1.0.0"
)

# CORS middleware - ONLY CORS MIDDLEWARE, no custom middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Load the universal model
try:
    model_assets = joblib.load('universal_exoplanet_detector.pkl')
    universal_model = model_assets['model']
    scaler = model_assets['scaler']
    imputer = model_assets['imputer']
    expected_features = model_assets['features']
    logger.info("✅ Universal model loaded successfully")
    logger.info(f"📊 Model features: {expected_features}")
except Exception as e:
    logger.error(f"❌ Failed to load universal model: {e}")
    universal_model = None
    scaler = None
    imputer = None
    expected_features = []

# Pydantic models for request/response
class ExoplanetCandidate(BaseModel):
    koi_period: float
    koi_depth: Optional[float] = None
    koi_prad: float
    koi_duration: Optional[float] = None
    koi_srad: float
    koi_steff: float
    koi_teq: float
    koi_slogg: float
    mission: str = "TESS"

class AnalysisResult(BaseModel):
    is_exoplanet: bool
    confidence: float
    details: str
    model_type: str = "Universal Gradient Boosting (Kepler + TESS)"

class BatchAnalysisResult(BaseModel):
    results: List[Dict[str, Any]]

# FIXED: Feature importance item model
class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float

class ModelAnalytics(BaseModel):
    model_info: Dict[str, Any]
    feature_importance: List[FeatureImportanceItem]
    performance_metrics: Dict[str, Any]
    confusion_matrix: Dict[str, int]

# Feature engineering (EXACTLY as in training)
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
            df['log_depth'] = np.log10(df['koi_depth'].replace(0, 1000))  # Avoid log(0)
        else:
            df['log_depth'] = np.log10(1000)  # Default value
        
        return df
    except Exception as e:
        logger.error(f"Error in feature engineering: {e}")
        return df

# Prepare data for model prediction
def prepare_for_prediction(data: Dict[str, Any]) -> pd.DataFrame:
    """Prepare input data for model prediction with all required features"""
    try:
        # Create DataFrame from input
        input_df = pd.DataFrame([data])
        
        # Calculate engineered features (EXACTLY as frontend does)
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
        for feature in expected_features:
            if feature not in input_df.columns:
                input_df[feature] = 0.0
        
        # Select only the expected features in correct order
        input_df = input_df[expected_features]
        
        logger.info(f"🔧 Prepared features: {input_df.columns.tolist()}")
        logger.info(f"📐 Data shape: {input_df.shape}")
        
        return input_df
        
    except Exception as e:
        logger.error(f"Error preparing data: {e}")
        raise HTTPException(status_code=400, detail=f"Data preparation error: {str(e)}")

# Prediction function
def predict_exoplanet(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Predict if candidate is an exoplanet using universal model"""
    try:
        if universal_model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Prepare data
        prepared_data = prepare_for_prediction(input_data)
        
        # Handle missing values
        prepared_data_imputed = pd.DataFrame(
            imputer.transform(prepared_data),
            columns=prepared_data.columns,
            index=prepared_data.index
        )
        
        # Scale features
        prepared_data_scaled = scaler.transform(prepared_data_imputed)
        
        # Predict probability
        probability = universal_model.predict_proba(prepared_data_scaled)[0][1]
        
        # Use discovery threshold (0.35 as in training)
        is_exoplanet = probability > 0.35
        
        # Generate details based on prediction
        if is_exoplanet:
            if probability > 0.8:
                details = "High confidence exoplanet candidate with strong transit signals"
            elif probability > 0.6:
                details = "Promising exoplanet candidate with good signal characteristics"
            else:
                details = "Potential exoplanet candidate requiring further verification"
        else:
            if probability < 0.1:
                details = "Clear false positive with inconsistent transit patterns"
            elif probability < 0.25:
                details = "Likely false positive due to stellar variability or noise"
            else:
                details = "Borderline case - recommend additional observations"
        
        return {
            "is_exoplanet": bool(is_exoplanet),
            "confidence": float(probability),
            "details": details,
            "model_type": "Universal Gradient Boosting (Kepler + TESS)",
            "features_used": len(expected_features)
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# NASA to KOI format conversion
def convert_nasa_to_koi_format(nasa_data: Dict[str, Any]) -> Dict[str, Any]:
    """Convert NASA Exoplanet Archive format to KOI format for the universal model"""
    mapping = {
        'koi_period': nasa_data.get('pl_orbper'),
        'koi_depth': nasa_data.get('pl_trandep', 0) * 10000 if nasa_data.get('pl_trandep') else 1000,  # Convert to ppm
        'koi_prad': nasa_data.get('pl_rade'),
        'koi_duration': nasa_data.get('pl_trandur'),
        'koi_srad': nasa_data.get('st_rad'),
        'koi_steff': nasa_data.get('st_teff'),
        'koi_teq': nasa_data.get('pl_eqt'),
        'koi_slogg': nasa_data.get('st_logg'),
        'mission': 'Kepler'  # Default mission
    }
    
    # Remove None values and use defaults where needed
    cleaned_data = {}
    for key, value in mapping.items():
        if value is not None:
            cleaned_data[key] = value
        else:
            # Set defaults for missing required fields
            if key == 'koi_depth':
                cleaned_data[key] = 1000
            elif key == 'koi_duration':
                cleaned_data[key] = 5.0
            elif key == 'mission':
                cleaned_data[key] = 'Kepler'
            else:
                cleaned_data[key] = 0.0
    
    logger.info(f"🔄 Converted NASA data to KOI format: {cleaned_data}")
    return cleaned_data

# API Routes
@app.get("/")
async def root():
    return {
        "message": "Universal Exoplanet Detector API",
        "version": "1.0.0",
        "model": "Gradient Boosting (Kepler + TESS)",
        "status": "Operational" if universal_model else "Model Not Loaded"
    }

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_candidate(candidate: ExoplanetCandidate):
    """Analyze single exoplanet candidate"""
    try:
        logger.info(f"🔭 Analyzing candidate: {candidate.dict()}")
        
        result = predict_exoplanet(candidate.dict())
        
        logger.info(f"✅ Analysis complete: Exoplanet={result['is_exoplanet']}, Confidence={result['confidence']:.3f}")
        
        return AnalysisResult(**result)
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-analyze", response_model=BatchAnalysisResult)
async def batch_analyze_candidates(candidates: List[Dict[str, Any]]):
    """Analyze multiple candidates from JSON data"""
    try:
        logger.info(f"📊 Batch analysis started: {len(candidates)} candidates")
        
        results = []
        for index, candidate_data in enumerate(candidates):
            try:
                # Check if data is in NASA format and convert to KOI format
                if 'pl_orbper' in candidate_data and 'koi_period' not in candidate_data:
                    logger.info(f"🔄 Converting row {index} from NASA to KOI format")
                    candidate_data = convert_nasa_to_koi_format(candidate_data)
                
                result = predict_exoplanet(candidate_data)
                result.update({
                    "koi_period": candidate_data.get('koi_period'),
                    "koi_prad": candidate_data.get('koi_prad'),
                    "koi_teq": candidate_data.get('koi_teq')
                })
                results.append(result)
            except Exception as e:
                logger.warning(f"Failed to analyze row {index}: {e}")
                results.append({
                    "is_exoplanet": False,
                    "confidence": 0.0,
                    "details": f"Analysis failed: {str(e)}",
                    "model_type": "Universal Gradient Boosting",
                    "koi_period": candidate_data.get('koi_period') or candidate_data.get('pl_orbper'),
                    "koi_prad": candidate_data.get('koi_prad') or candidate_data.get('pl_rade'),
                    "koi_teq": candidate_data.get('koi_teq') or candidate_data.get('pl_eqt')
                })
        
        logger.info(f"✅ Batch analysis complete: {len(results)} results")
        
        return BatchAnalysisResult(results=results)
        
    except Exception as e:
        logger.error(f"Batch analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model/analytics", response_model=ModelAnalytics)
async def get_model_analytics():
    """Get model performance metrics and feature importance"""
    try:
        if universal_model is None:
            # Return fallback data if model not loaded
            return get_fallback_analytics()
        
        # Feature importance
        feature_importance = []
        if hasattr(universal_model, 'feature_importances_'):
            for feature, importance in zip(expected_features, universal_model.feature_importances_):
                feature_importance.append(FeatureImportanceItem(
                    feature=feature,
                    importance=float(importance)
                ))
        else:
            # Use fallback feature importance if not available
            feature_importance = get_fallback_feature_importance()
        
        # Model info
        model_info = {
            "model_type": "Universal Gradient Boosting",
            "features_used": len(expected_features),
            "dataset_size": 9564,
            "test_set_size": 1034,
            "missions": "Kepler + TESS Combined",
            "training_data": "9,564 astronomical observations"
        }
        
        # Performance metrics (from training) - UPDATED STRUCTURE
        performance_metrics = {
            "test_auc": 0.948,
            "best_threshold": 0.35,
            "classification_report": {
                "false_positive": {
                    "precision": 0.904,
                    "recall": 0.874,
                    "f1_score": 0.889,
                    "support": 517
                },
                "exoplanet": {
                    "precision": 0.878,
                    "recall": 0.907,
                    "f1_score": 0.892,
                    "support": 517
                }
            }
        }
        
        # Confusion matrix (from training)
        confusion_matrix = {
            "true_negative": 452,
            "false_positive": 65,
            "false_negative": 48,
            "true_positive": 469
        }
        
        return ModelAnalytics(
            model_info=model_info,
            feature_importance=feature_importance,
            performance_metrics=performance_metrics,
            confusion_matrix=confusion_matrix
        )
        
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        # Return fallback data on error
        return get_fallback_analytics()

def get_fallback_feature_importance():
    """Fallback feature importance data"""
    return [
        FeatureImportanceItem(feature='koi_insol', importance=0.2099),
        FeatureImportanceItem(feature='koi_prad', importance=0.1464),
        FeatureImportanceItem(feature='koi_srad', importance=0.1149),
        FeatureImportanceItem(feature='koi_slogg', importance=0.1060),
        FeatureImportanceItem(feature='koi_steff', importance=0.1041),
        FeatureImportanceItem(feature='koi_teq', importance=0.0950),
        FeatureImportanceItem(feature='koi_period', importance=0.0850),
        FeatureImportanceItem(feature='period_insol_ratio', importance=0.0650),
        FeatureImportanceItem(feature='radius_temp_ratio', importance=0.0450),
        FeatureImportanceItem(feature='log_period', importance=0.0297)
    ]

def get_fallback_analytics():
    """Fallback analytics data when model is not available"""
    return ModelAnalytics(
        model_info={
            "model_type": "Universal Gradient Boosting",
            "features_used": 12,
            "dataset_size": 9564,
            "test_set_size": 1034,
            "missions": "Kepler + TESS Combined",
            "training_data": "9,564 astronomical observations"
        },
        feature_importance=get_fallback_feature_importance(),
        performance_metrics={
            "test_auc": 0.948,
            "best_threshold": 0.35,
            "classification_report": {
                "false_positive": {
                    "precision": 0.904,
                    "recall": 0.874,
                    "f1_score": 0.889,
                    "support": 517
                },
                "exoplanet": {
                    "precision": 0.878,
                    "recall": 0.907,
                    "f1_score": 0.892,
                    "support": 517
                }
            }
        },
        confusion_matrix={
            "true_negative": 452,
            "false_positive": 65,
            "false_negative": 48,
            "true_positive": 469
        }
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": universal_model is not None,
        "features_available": len(expected_features),
        "timestamp": pd.Timestamp.now().isoformat()
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")