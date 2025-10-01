import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException

from services.feature_service import predict_exoplanet
from services.conversion_service import convert_nasa_to_koi_format
from models.schemas import ExoplanetCandidate, AnalysisResult, BatchAnalysisResult

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_candidate(candidate: ExoplanetCandidate):
    """Analyze single exoplanet candidate"""
    try:
        logger.info(f"🔭 Analyzing candidate: {candidate.model_dump()}")

        result = predict_exoplanet(candidate.model_dump())

        logger.info(
            f"✅ Analysis complete: Exoplanet={result['is_exoplanet']}, Confidence={result['confidence']:.3f}")

        return AnalysisResult(**result)

    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-analyze", response_model=BatchAnalysisResult)
async def batch_analyze_candidates(candidates: List[Dict[str, Any]]):
    """Analyze multiple candidates from JSON data"""
    try:
        logger.info(f"📊 Batch analysis started: {len(candidates)} candidates")

        results = []
        for index, candidate_data in enumerate(candidates):
            try:
                # Check if data is in NASA format and convert to KOI format
                if 'pl_orbper' in candidate_data and 'koi_period' not in candidate_data:
                    logger.info(
                        f"🔄 Converting row {index} from NASA to KOI format")
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
                    "model_type": "Gradient Boosting",
                    "koi_period": candidate_data.get('koi_period') or candidate_data.get('pl_orbper'),
                    "koi_prad": candidate_data.get('koi_prad') or candidate_data.get('pl_rade'),
                    "koi_teq": candidate_data.get('koi_teq') or candidate_data.get('pl_eqt')
                })

        logger.info(f"✅ Batch analysis complete: {len(results)} results")

        return BatchAnalysisResult(results=results)

    except Exception as e:
        logger.error(f"Batch analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
