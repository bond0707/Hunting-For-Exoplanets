import os
import json
import logging
from typing import List, Optional, Dict, Any

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, RootModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI(title="Exoplanet Detection API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

MODELS = {}
ANALYTICS = {}
try:
    logger.info("🚀 Verifying and loading all assets...")
    required_files = {
        "kepler_specialist": 'models/kepler_specialist_tuned.pkl', "tess_specialist": 'models/tess_specialist_tuned.pkl',
        "k2_specialist": 'models/k2_specialist_tuned.pkl', "universal_finder": 'models/universal_planet_finder_tuned.pkl',
        "fake_detector": 'models/fake_detector_specialist_tuned.pkl', "meta_model": 'models/meta_model_final.pkl',
        "analytics_data": 'model_analytics.json'
    }
    for name, path in required_files.items():
        if not os.path.exists(path): raise FileNotFoundError(f"Missing required file: {path}")
    
    for model_name, path in required_files.items():
        if model_name == "analytics_data":
            with open(path, 'r') as f: ANALYTICS = json.load(f)
        else: MODELS[model_name] = joblib.load(path)
    logger.info("✅ All assets loaded successfully.")
except Exception as e:
    logger.error(f"❌ FATAL: A critical error occurred during server startup: {e}")
    raise e

KEPLER_FEATURES = ['koi_score', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec', 'period', 'planet_radius', 'planet_temp', 'koi_depth', 'koi_duration', 'koi_impact', 'depth_over_duration', 'radius_over_period']
TESS_FEATURES = ['period', 'planet_radius', 'planet_temp', 'stellar_radius', 'stellar_temp', 'stellar_logg', 'pl_trandep', 'pl_trandurh', 'st_tmag']
K2_FEATURES = ['period', 'planet_radius', 'planet_temp', 'stellar_radius', 'stellar_temp', 'stellar_logg', 'pl_trandep', 'pl_trandur']
UNIVERSAL_FEATURES = ['period', 'planet_radius', 'planet_temp', 'stellar_radius', 'stellar_temp', 'stellar_logg']
FRONTEND_TO_BACKEND_MAP = {'koi_period': 'period', 'koi_prad': 'planet_radius', 'koi_teq': 'planet_temp', 'pl_orbper': 'period', 'pl_rade': 'planet_radius', 'pl_eqt': 'planet_temp', 'st_rad': 'stellar_radius', 'st_teff': 'stellar_temp'}

class SingleAnalysisData(BaseModel):
    koi_period: Optional[float] = None; koi_prad: Optional[float] = None; koi_teq: Optional[float] = None; koi_depth: Optional[float] = None; koi_duration: Optional[float] = None; koi_impact: Optional[float] = None; koi_score: Optional[float] = None; koi_fpflag_nt: Optional[int] = None; koi_fpflag_ss: Optional[int] = None; koi_fpflag_co: Optional[int] = None; koi_fpflag_ec: Optional[int] = None; pl_orbper: Optional[float] = None; pl_rade: Optional[float] = None; pl_eqt: Optional[float] = None; st_rad: Optional[float] = None; st_teff: Optional[float] = None; st_logg: Optional[float] = None; pl_trandep: Optional[float] = None; pl_trandurh: Optional[float] = None; st_tmag: Optional[float] = None; pl_trandur: Optional[float] = None; period: Optional[float] = None; planet_radius: Optional[float] = None; planet_temp: Optional[float] = None; stellar_radius: Optional[float] = None; stellar_temp: Optional[float] = None; stellar_logg: Optional[float] = None
class BatchAnalysisItem(SingleAnalysisData): mission: str
class BatchAnalysisRequest(RootModel[List[BatchAnalysisItem]]): pass
class AnalysisResponse(BaseModel): is_exoplanet: bool; confidence: float; details: str; model_type: str; mission: str

def _perform_analysis(mission: str, data: SingleAnalysisData) -> AnalysisResponse:
    input_data = data.dict(exclude_unset=True)
    mapped_data = {FRONTEND_TO_BACKEND_MAP.get(k, k): v for k, v in input_data.items()}
    epsilon = 1e-6
    mapped_data['depth_over_duration'] = (mapped_data.get('koi_depth') or 0.0) / ((mapped_data.get('koi_duration') or 0.0) + epsilon)
    mapped_data['radius_over_period'] = (mapped_data.get('planet_radius') or 0.0) / ((mapped_data.get('period') or 0.0) + epsilon)
    kepler_input = [mapped_data.get(f, 0.0) for f in KEPLER_FEATURES]; kepler_pred = MODELS['kepler_specialist'].predict_proba([kepler_input])[0][1]
    tess_input = [mapped_data.get(f, 0.0) for f in TESS_FEATURES]; tess_pred = MODELS['tess_specialist'].predict_proba([tess_input])[0][1]
    k2_input = [mapped_data.get(f, 0.0) for f in K2_FEATURES]; k2_pred = MODELS['k2_specialist'].predict_proba([k2_input])[0][1]
    universal_input = [mapped_data.get(f, 0.0) for f in UNIVERSAL_FEATURES]; universal_pred = MODELS['universal_finder'].predict_proba([universal_input])[0][1]
    fake_detector_pred = MODELS['fake_detector'].predict_proba([universal_input])[0][1]
    predictions = [kepler_pred, tess_pred, k2_pred, universal_pred, fake_detector_pred]
    final_confidence = MODELS['meta_model'].predict_proba([predictions])[0][1]
    is_exoplanet = final_confidence > 0.35
    details = "High confidence candidate." if final_confidence > 0.8 else "Potential candidate."
    return AnalysisResponse(is_exoplanet=is_exoplanet, confidence=final_confidence, details=details, model_type="5-Model Ensemble", mission=mission)

@app.get("/")
async def root(): return {"status": "online"}

@app.post("/analyze/{mission}", response_model=AnalysisResponse)
async def analyze_candidate(mission: str, data: SingleAnalysisData):
    try: return _perform_analysis(mission, data)
    except Exception as e:
        logger.error(f"❌ Analysis error for mission {mission}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-analyze")
async def batch_analyze(request: BatchAnalysisRequest):
    results = []
    for item in request.root:
        try: results.append(_perform_analysis(item.mission, SingleAnalysisData(**item.dict())).dict())
        except Exception as e: results.append({"is_exoplanet": False, "confidence": 0.0, "details": str(e), "model_type": "Error", "mission": item.mission or "unknown"})
    return {"results": results}

@app.get("/model/analytics")
async def get_model_analytics(model: Optional[str] = None):
    # If a specific model's features are requested, return only them.
    if model and model.lower() in ANALYTICS.get("specialist_feature_importance", {}):
        model_key = model.lower()
        logger.info(f"📊 Fetching feature importance for specialist: {model_key}")
        return {"feature_importance": ANALYTICS["specialist_feature_importance"][model_key]}
    
    # Otherwise, this is the initial page load. Return all performance metrics,
    # and use Kepler's feature importance as the default view.
    logger.info("📊 Fetching full ensemble analytics with 'Kepler' as default features...")
    full_analytics = ANALYTICS.copy()
    # Ensure the main 'feature_importance' key is populated with the default for the frontend
    full_analytics["feature_importance"] = ANALYTICS.get("specialist_feature_importance", {}).get("kepler", [])
    return full_analytics

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)