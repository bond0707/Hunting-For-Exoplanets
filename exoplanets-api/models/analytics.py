from pydantic import BaseModel
from typing import List, Dict, Any

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float

class ModelAnalytics(BaseModel):
    model_info: Dict[str, Any]
    feature_importance: List[FeatureImportanceItem]
    performance_metrics: Dict[str, Any]
    confusion_matrix: Dict[str, int]
