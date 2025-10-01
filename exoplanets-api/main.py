from fastapi import FastAPI
from config import get_settings
from routes import analysis, analytics, health
from fastapi.middleware.cors import CORSMiddleware
from utils.exceptions import add_exception_handlers

# Initialize FastAPI app
app = FastAPI(
    title="Exoplanet Detection API",
    description="API for detecting exoplanets using Kepler + TESS trained model",
    version="1.0.0"
)

# Add CORS middleware
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
add_exception_handlers(app)

# Include routers
app.include_router(analysis.router, tags=["analysis"])
app.include_router(analytics.router, tags=["analytics"])
app.include_router(health.router, tags=["health"])


@app.get("/")
async def root():
    return {
        "message": "Exoplanet Detection API",
        "version": "1.0.0",
        "status": "Operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
