from typing import List
from schemas import ExoplanetData, PredictionResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
import numpy as np
import pandas as pd
import joblib
import warnings
import json
# The incorrect import 'from sklearn.exceptions import UserWarning' has been removed.
# UserWarning is a built-in type that warnings.filterwarnings can use directly.

warnings.filterwarnings("ignore", category=UserWarning)


app = FastAPI(
    title="ExoPlanet AI API",
    description="API for classifying exoplanet candidates using an ensemble ML model.",
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
    model_pipeline = joblib.load("exoplanet_best_model.joblib")
    threshold = 0.046
    print("✅ Model loaded successfully!")
except FileNotFoundError:
    print("🛑 Error: 'exoplanet_best_model.joblib' not found.")
    model_pipeline = None
    threshold = None


def get_prediction(data: ExoplanetData):
    if not model_pipeline or not threshold:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    input_df = pd.DataFrame([data.model_dump()])

    input_df["radius_ratio"] = input_df["planet_radius"] / \
        (input_df["stellar_radius"] + 1e-9)
    input_df["depth_norm"] = input_df["transit_depth"] / \
        ((input_df["stellar_radius"] + 1e-9) ** 2)
    input_df["period_temp_ratio"] = input_df["orbital_period"] / \
        (input_df["eq_temp"] + 1)

    try:
        probability = model_pipeline.predict_proba(input_df)[:, 1][0]
    except Exception as e:
        return {"error": str(e)}

    is_exoplanet = bool(probability >= threshold)
    confidence_score = probability if is_exoplanet else 1 - probability

    if is_exoplanet:
        if confidence_score > 0.80:
            detail_message = f"Very strong candidate."
        elif confidence_score > 0.50:
            detail_message = f"Promising candidate."
        else:
            detail_message = f"Weak candidate."
    else:
        detail_message = f"Likely not an exoplanet."

    return {
        "is_exoplanet": is_exoplanet,
        "confidence": confidence_score,
        "details": detail_message
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
    return {"status": "ok", "message": "Welcome to the ExoPlanet AI API!"}


@app.post("/analyze", response_model=PredictionResponse)
def analyze_candidate(data: ExoplanetData):
    result = get_prediction(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.post("/batch-analyze")
def batch_analyze_candidates(candidates: List[ExoplanetData]):
    results = []
    for candidate_data in candidates:
        prediction = get_prediction(candidate_data)
        full_result = {**candidate_data.model_dump(), **prediction}
        results.append(full_result)
    return results
