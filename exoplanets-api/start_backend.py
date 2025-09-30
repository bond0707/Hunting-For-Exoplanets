#!/usr/bin/env python3
"""
Startup script for Universal Exoplanet Detector Backend
"""

import uvicorn
import os
import sys

def main():
    # Check if model file exists
    if not os.path.exists("universal_exoplanet_detector.pkl"):
        print("❌ Error: universal_exoplanet_detector.pkl not found!")
        print("Please ensure your trained model file is in the current directory")
        sys.exit(1)
    
    print("🚀 Starting Universal Exoplanet Detector Backend")
    print("🌌 Model: Gradient Boosting (Kepler + TESS)")
    print("🔗 API: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop\n")
    
    # Start the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()