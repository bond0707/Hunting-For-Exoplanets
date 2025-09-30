
import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        sys.exit(1)

def check_model_file():
    """Check if model file exists"""
    model_path = "universal_exoplanet_detector.pkl"
    if not os.path.exists(model_path):
        print(f"⚠️  Warning: Model file '{model_path}' not found")
        print("   Please ensure your trained model is in the backend directory")
        return False
    else:
        print("✅ Model file found")
        return True

def create_sample_data():
    """Create sample data for testing"""
    sample_data = """koi_period,koi_depth,koi_prad,koi_duration,koi_srad,koi_steff,koi_teq,koi_slogg,mission
129.9,430,1.17,5.3,0.52,3755,188,4.7,Kepler
0.73,370,1.88,1.8,0.94,5196,2000,4.3,TESS
15.2,280,2.34,3.1,0.78,4500,320,4.5,Kepler
45.6,510,0.95,4.7,0.61,3900,245,4.6,Kepler
3.8,190,3.21,2.4,1.12,5800,890,4.2,TESS"""
    
    with open("sample_candidates.csv", "w") as f:
        f.write(sample_data)
    print("✅ Sample data created: sample_candidates.csv")

def main():
    print("🚀 Setting up Universal Exoplanet Detector Backend")
    print("=" * 50)
    
    install_requirements()
    check_model_file()
    create_sample_data()
    
    print("\n🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Ensure 'universal_exoplanet_detector.pkl' is in the backend directory")
    print("2. Run: uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    print("3. Access API at: http://localhost:8000")
    print("4. Access docs at: http://localhost:8000/docs")
    print("\n🌌 Frontend should connect to: http://localhost:8000")

if __name__ == "__main__":
    main()