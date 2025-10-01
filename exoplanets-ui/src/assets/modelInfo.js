export const getFallbackData = () => {
    console.log('🔄 Using fallback analytics data');
    return {
        model_info: {
            model_type: "Gradient Boosting",
            features_used: 12,
            dataset_size: 9564,
            test_set_size: 1034,
            missions: "Kepler + TESS Combined"
        },
        feature_importance: [
            { feature: 'koi_insol', importance: 0.2099 },
            { feature: 'koi_prad', importance: 0.1464 },
            { feature: 'koi_srad', importance: 0.1149 },
            { feature: 'koi_slogg', importance: 0.1060 },
            { feature: 'koi_steff', importance: 0.1041 },
            { feature: 'koi_teq', importance: 0.0950 },
            { feature: 'koi_period', importance: 0.0850 },
            { feature: 'period_insol_ratio', importance: 0.0650 },
            { feature: 'radius_temp_ratio', importance: 0.0450 },
            { feature: 'log_period', importance: 0.0297 }
        ],
        performance_metrics: {
            test_auc: 0.948,
            best_f1: 0.892,
            best_threshold: 0.35,
            classification_report: {
                "0": {
                    precision: 0.904,
                    recall: 0.874,
                    "f1-score": 0.889,
                    support: 517
                },
                "1": {
                    precision: 0.878,
                    recall: 0.907,
                    "f1-score": 0.892,
                    support: 517
                }
            }
        },
        confusion_matrix: {
            true_negative: 452,
            false_positive: 65,
            false_negative: 48,
            true_positive: 469
        }
    };
};

export const rocData = [
    { threshold: "0.0", fpr: 0.0, tpr: 0.0 },
    { threshold: "0.1", fpr: 0.05, tpr: 0.25 },
    { threshold: "0.2", fpr: 0.12, tpr: 0.45 },
    { threshold: "0.3", fpr: 0.18, tpr: 0.65 },
    { threshold: "0.4", fpr: 0.25, tpr: 0.78 },
    { threshold: "0.5", fpr: 0.32, tpr: 0.85 },
    { threshold: "0.6", fpr: 0.41, tpr: 0.90 },
    { threshold: "0.7", fpr: 0.52, tpr: 0.93 },
    { threshold: "0.8", fpr: 0.65, tpr: 0.96 },
    { threshold: "0.9", fpr: 0.78, tpr: 0.98 },
    { threshold: "1.0", fpr: 1.0, tpr: 1.0 }
];