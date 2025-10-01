import pandas as pd
from fastapi import APIRouter
from services.model_service import model_service

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model_service.is_loaded(),
        "features_available": len(model_service.expected_features) if model_service.is_loaded() else 0,
        "timestamp": pd.Timestamp.now().isoformat()
    }
