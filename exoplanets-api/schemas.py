# schemas.py
from pydantic import BaseModel
from typing import Literal

# Defines the structure of the data the user will send


class ExoplanetData(BaseModel):
    orbital_period: float
    transit_depth: float
    planet_radius: float
    transit_duration: float
    stellar_radius: float
    stellar_teff: int
    eq_temp: int
    # Assuming these are the possible values
    mission: Literal['Kepler', 'K2', 'TESS']

# Defines the structure of the data the API will send back


class PredictionResponse(BaseModel):
    is_exoplanet: bool
    confidence: float
    details: str
