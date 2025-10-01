# Seek.AI - Exoplanet Detector

**A machine learning application for the NASA Space Apps Challenge that classifies exoplanet candidates from transit data.**

This project uses an ensemble model to predict whether an astronomical candidate is a genuine exoplanet. It features a user-friendly web interface for single-candidate analysis, batch analysis via CSV upload, and interactive visualizations of the model's performance.

---

### Features

* **Single Candidate Analysis:** Enter transit data manually to get an instant prediction and confidence score.
* **Batch CSV Analysis:** Upload a CSV file with multiple candidates for bulk processing.
* **Interactive Visualizations:** View results with a pie chart, a scatter plot, and an illustrative light curve.
* **About the Model:** An interactive page showing the model's feature importances and performance metrics.
* **Sample Data:** Instantly load data for real, known exoplanets to test the model.

---

### Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts
* **Backend:** Python, FastAPI
* **Machine Learning:** Scikit-learn, Pandas, XGBoost, LightGBM, CatBoost 

---

### How to Run

**1. Backend Setup (`exoplanets-api`)**

You need to download the model [from here](https://drive.google.com/file/d/11vfoo2QXRbWua5R5mXeTTpJQXFHrwMCw/view?usp=drive_link "exoplanet_best_model.joblib") and store it into the `exoplanets-api/` directory. Then you need to follow the given commands.

```powershell
# Navigate to the backend folder
cd exoplanets-api

# Create and activate a virtual environment
python -m venv .venv
& .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

**2. Frontend Setup (`exoplanets-ui`)**

```powershell
# Open a new terminal and navigate to the frontend folder
cd exoplanets-ui

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Future Updates

* [ ] Add more graphs in the "Analytics" page.
* [ ] Remove the occurence white border in "Feature Importance" graph in "Analytics" page when it is clicked.
* [ ] Add animations to "Feature Details" component and the component below it on the "Analytics" page for whenever the "Feature Details" component is modified.
* [ ] Update "Tech Stack" section of the `README.md` with correct ML model names (whatever we decide to use in the end)
