# schemas.py

from typing import List, Optional
from pydantic import BaseModel, RootModel

# Defines the full set of possible input features for a single analysis
class SingleAnalysisData(BaseModel):
    koi_period: Optional[float] = None
    koi_prad: Optional[float] = None
    koi_teq: Optional[float] = None
    koi_depth: Optional[float] = None
    koi_duration: Optional[float] = None
    koi_impact: Optional[float] = None
    koi_score: Optional[float] = None
    koi_fpflag_nt: Optional[int] = None
    koi_fpflag_ss: Optional[int] = None
    koi_fpflag_co: Optional[int] = None
    koi_fpflag_ec: Optional[int] = None
    pl_orbper: Optional[float] = None
    pl_rade: Optional[float] = None
    pl_eqt: Optional[float] = None
    st_rad: Optional[float] = None
    st_teff: Optional[float] = None
    st_logg: Optional[float] = None
    pl_trandep: Optional[float] = None
    pl_trandurh: Optional[float] = None
    st_tmag: Optional[float] = None
    pl_trandur: Optional[float] = None
    period: Optional[float] = None
    planet_radius: Optional[float] = None
    planet_temp: Optional[float] = None
    stellar_radius: Optional[float] = None
    stellar_temp: Optional[float] = None
    stellar_logg: Optional[float] = None

# Extends the single analysis model with a required mission field for batch processing
class BatchAnalysisItem(SingleAnalysisData):
    mission: str

# Defines the structure for a batch analysis request, which is a list of items
class BatchAnalysisRequest(RootModel[List[BatchAnalysisItem]]):
    pass

# Defines the structure of the API response for an analysis
class AnalysisResponse(BaseModel):
    is_exoplanet: bool
    confidence: float
    details: str
    model_type: str
    mission: str