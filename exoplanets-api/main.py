# main.py
import logging
import uvicorn
from routes import analysis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create FastAPI app
app = FastAPI(
    title="Exoplanet Detection API",
    version="2.0",
    description="API for detecting exoplanets from Kepler, K2, and TESS mission data."
)

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the analysis router
app.include_router(analysis.router, tags=["Analysis"])

@app.get("/", tags=["Status"])
async def root():
    """Root endpoint to check API status."""
    return {"status": "online", "message": "Welcome to the Exoplanet Detection API!"}

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)