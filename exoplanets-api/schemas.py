from pydantic import BaseModel
from typing import Optional

class ExoplanetData(BaseModel):
    koi_period: float
    koi_depth: float
    koi_prad: float
    koi_duration: float
    koi_srad: float
    koi_steff: float
    koi_teq: float
    mission: str
    koi_slogg: Optional[float] = None  # Add if your model needs it

class PredictionResponse(BaseModel):
    is_exoplanet: bool
    confidence: float
    details: str
    threshold_used: float
    model_type: str