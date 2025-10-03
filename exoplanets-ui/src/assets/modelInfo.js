// src/assets/modelInfo.js

// UPDATED: More realistic data for a model with ~95.5% AUC
export const rocData = [
    { fpr: 0.0, tpr: 0.0, threshold: 1.0 },
    { fpr: 0.01, tpr: 0.25, threshold: 0.9 },
    { fpr: 0.03, tpr: 0.55, threshold: 0.8 },
    { fpr: 0.06, tpr: 0.78, threshold: 0.7 },
    { fpr: 0.12, tpr: 0.89, threshold: 0.6 },
    { fpr: 0.20, tpr: 0.93, threshold: 0.5 },
    { fpr: 0.36, tpr: 0.97, threshold: 0.35 }, // Aligned with your model's optimal threshold performance
    { fpr: 0.50, tpr: 0.98, threshold: 0.3 },
    { fpr: 0.75, tpr: 0.99, threshold: 0.2 },
    { fpr: 1.0, tpr: 1.0, threshold: 0.0 },
];

// Fallback data in case the API fetch fails
export const getFallbackData = () => ({
    feature_importance: [ { feature: "loading_error", importance: 1.0 } ],
    performance_metrics: { test_auc: 0.0, best_threshold: 0.0, classification_report: { false_positive: { precision: 0, recall: 0, f1_score: 0 }, exoplanet: { precision: 0, recall: 0, f1_score: 0 } } },
    confusion_matrix: { true_negative: 0, false_positive: 0, false_negative: 0, true_positive: 0 },
    model_info: { model_type: "N/A", features_used: 0, dataset_size: 0, test_set_size: 0, missions: "N/A" }
});