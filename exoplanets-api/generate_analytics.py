# Make sure you are in the exoplanet_api folder with venv active
# python generate_analytics.py

import pandas as pd
import numpy as np
import joblib
import json
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix, precision_recall_curve
from sklearn.pipeline import Pipeline

print("Starting analytics generation...")

# --- Step 1: Load Data and Model ---
print("Loading dataset and pre-trained model...")
df = pd.read_csv("Exoplanets.csv")
# This must match the model file used in your main.py
model_pipeline = joblib.load("exoplanet_best_model.joblib")

# --- Step 2: Recreate the EXACT same training/test split ---
# This ensures we evaluate on the same data the model was tested on in the notebook.
print("Recreating train/test split...")
# Feature Engineering from the notebook (the version for exoplanet_best_model.joblib)
df["radius_ratio"] = df["planet_radius"] / (df["stellar_radius"] + 1e-9)
df["depth_norm"] = df["transit_depth"] / ((df["stellar_radius"] + 1e-9) ** 2)
df["period_temp_ratio"] = df["orbital_period"] / (df["eq_temp"] + 1)

numeric_features = [
    "orbital_period", "planet_radius", "transit_depth", "transit_duration",
    "eq_temp", "stellar_teff", "stellar_radius",
    "radius_ratio", "depth_norm", "period_temp_ratio"
]
categorical_features = ["mission"]
target_col = "label"

X = df[numeric_features + categorical_features]
y = df[target_col].astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# --- Step 3: Calculate Performance Metrics ---
print("Calculating performance metrics...")
y_proba = model_pipeline.predict_proba(X_test)[:, 1]
test_auc = roc_auc_score(y_test, y_proba)

prec, rec, thresh = precision_recall_curve(y_test, y_proba)
f1_scores = 2 * (prec * rec) / (prec + rec + 1e-12)
best_f1_idx = np.argmax(f1_scores)
best_threshold = thresh[best_f1_idx]
best_f1 = f1_scores[best_f1_idx]

y_pred_tuned = (y_proba >= best_threshold).astype(int)
report = classification_report(y_test, y_pred_tuned, output_dict=True)
tn, fp, fn, tp = confusion_matrix(y_test, y_pred_tuned).ravel()

performance_data = {
    "test_auc": test_auc,
    "best_f1": best_f1,
    "best_threshold": best_threshold,
    "classification_report": {
        "0": report["0"],
        "1": report["1"]
    }
}

confusion_matrix_data = {
    "true_negative": int(tn),
    "false_positive": int(fp),
    "false_negative": int(fn),
    "true_positive": int(tp)
}


# --- Step 4: Extract Feature Importance ---
# We access the trained models within the StackingClassifier
print("Extracting feature importances...")
stacking_classifier = model_pipeline.named_steps['clf']
# Let's use the feature importances from the RandomForest model as a representative example
rf_model = stacking_classifier.named_estimators_['rf']

# Get the feature names from the preprocessor step of the pipeline
preprocessor = model_pipeline.named_steps['preprocess']
ohe_feature_names = preprocessor.named_transformers_[
    'cat'].get_feature_names_out(categorical_features)
# The final feature names are the numeric ones + the one-hot encoded ones
final_feature_names = numeric_features + ohe_feature_names.tolist()

importances = rf_model.feature_importances_
feature_importance_data = sorted(
    [{"feature": name, "importance": imp}
        for name, imp in zip(final_feature_names, importances)],
    key=lambda x: x["importance"]
)


# --- Step 5: Combine and Save to JSON ---
analytics_data = {
    "feature_importance": feature_importance_data,
    "performance_metrics": performance_data,
    "confusion_matrix": confusion_matrix_data
}

with open("model_analytics.json", "w") as f:
    json.dump(analytics_data, f, indent=4)

print("\n✅ Successfully generated 'model_analytics.json'!")
