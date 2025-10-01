from pydantic import BaseModel
from typing import List, Optional, Dict, Any

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
    model_type: str = "Gradient Boosting (Kepler + TESS)"

class BatchAnalysisResult(BaseModel):
    results: List[Dict[str, Any]]
