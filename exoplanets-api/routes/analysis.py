import logging
from typing import Optional
from services import prediction
from fastapi import APIRouter, HTTPException
from schemas import (
    AnalysisResponse,
    SingleAnalysisData, 
    BatchAnalysisRequest,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/analyze/{mission}", response_model=AnalysisResponse)
async def analyze_candidate(mission: str, data: SingleAnalysisData):
    try:
        return prediction.perform_analysis(mission, data)
    except Exception as e:
        logger.error(f"❌ Analysis error for mission {mission}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch-analyze")
async def batch_analyze(request: BatchAnalysisRequest):
    results = []
    for item in request.root:
        try:
            result = prediction.perform_analysis(item.mission, item)
            results.append(result.model_dump())
        except Exception as e:
            logger.error(
                f"❌ Batch analysis error for mission {item.mission}: {e}")
            results.append({
                "is_exoplanet": False, "confidence": 0.0, "details": str(e),
                "model_type": "Error", "mission": item.mission or "unknown"
            })
    return {"results": results}


@router.get("/model/analytics")
async def get_model_analytics(model: Optional[str] = None):
    try:
        return prediction.get_analytics(model)
    except Exception as e:
        logger.error(f"❌ Analytics fetch error: {e}")
        raise HTTPException(
            status_code=500, detail="Could not retrieve model analytics.")
