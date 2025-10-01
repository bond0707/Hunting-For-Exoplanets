export const getFeatureDetails = (feature) => {
    if (!feature) return null;

    const featureDetails = {
        'koi_insol': {
            title: 'Insolation Flux',
            description: 'The amount of stellar radiation energy received by a planet per unit area. Calculated from stellar temperature and orbital period using the inverse square law. Higher values indicate planets closer to their stars receiving more energy.',
            impact: 'Primary predictor - distinguishes habitable zone planets from others',
            unit: 'Earth flux equivalents',
            range: '0.01 - 10,000+ (Earth = 1)',
            significance: 'Directly related to planetary temperature and potential habitability'
        },
        'koi_prad': {
            title: 'Planet Radius',
            description: 'The physical size of the planet measured in Earth radii. Critical for planetary classification: terrestrial planets (< 2 R⊕), sub-Neptunes (2-4 R⊕), and gas giants (> 4 R⊕).',
            impact: 'Determines planetary composition and atmospheric retention capability',
            unit: 'Earth radii (R⊕)',
            range: '0.5 - 30+ R⊕',
            significance: 'Key factor in distinguishing rocky planets from gas giants'
        },
        'koi_teq': {
            title: 'Equilibrium Temperature',
            description: 'The theoretical temperature of a planet assuming it is a black body heated only by its parent star. Calculated from stellar temperature, orbital distance, and planetary albedo.',
            impact: 'Critical for habitability assessment and planetary classification',
            unit: 'Kelvin (K)',
            range: '100 - 3000+ K',
            significance: 'Indicates potential for liquid water and atmospheric conditions'
        },
        'koi_period': {
            title: 'Orbital Period',
            description: 'The time taken for a planet to complete one full orbit around its host star. Related to orbital distance via Kepler\'s third law. Shorter periods indicate closer orbits and higher transit probabilities.',
            impact: 'Fundamental orbital characteristic affecting detection probability',
            unit: 'Days',
            range: '0.5 - 1000+ days',
            significance: 'Determines orbital distance and planetary system architecture'
        },
        'koi_steff': {
            title: 'Stellar Effective Temperature',
            description: 'The surface temperature of the host star, measured at the photosphere where optical depth reaches 2/3. Determines stellar spectral type and luminosity class.',
            impact: 'Affects planetary temperature and stellar activity levels',
            unit: 'Kelvin (K)',
            range: '2,500 - 10,000+ K',
            significance: 'Primary stellar characteristic influencing planetary conditions'
        },
        'koi_srad': {
            title: 'Stellar Radius',
            description: 'The physical size of the host star relative to our Sun. Combined with temperature to determine stellar luminosity. Affects transit depth and duration.',
            impact: 'Critical for accurate planetary parameter determination',
            unit: 'Solar radii (R☉)',
            range: '0.1 - 10+ R☉',
            significance: 'Essential for calculating true planetary radii from transit depths'
        },
        'koi_slogg': {
            title: 'Stellar Surface Gravity',
            description: 'The gravitational acceleration at the surface of the star, measured in log(cm/s²). Indicates stellar evolutionary stage: main sequence, giant, or subgiant.',
            impact: 'Helps validate stellar parameters and identify false positives',
            unit: 'log(cm/s²)',
            range: '3.5 - 5.0 log(cm/s²)',
            significance: 'Distinguishes main sequence stars from evolved stars'
        },
        'period_insol_ratio': {
            title: 'Period-Insolation Ratio',
            description: 'Engineered feature combining orbital period and insolation flux. Represents the efficiency of stellar energy delivery per orbital time unit. Higher values indicate more stable energy environments.',
            impact: 'Enhanced discrimination between planetary types and false positives',
            unit: 'Dimensionless',
            range: 'Varies by system',
            significance: 'Combines temporal and energetic aspects of planetary systems'
        },
        'radius_temp_ratio': {
            title: 'Radius-Temperature Ratio',
            description: 'Engineered feature relating planet size to equilibrium temperature. Indicates thermal expansion effects and atmospheric scale height. Useful for identifying inflated hot Jupiters.',
            impact: 'Cross-mission planetary characterization and validation',
            unit: 'R⊕/K',
            range: '0.001 - 0.1 R⊕/K',
            significance: 'Reveals relationships between planetary size and thermal environment'
        },
        'log_period': {
            title: 'Log Orbital Period',
            description: 'Logarithmic transformation of orbital period to handle the wide dynamic range of planetary orbits. Normalizes the distribution for better machine learning performance.',
            impact: 'Improves model sensitivity across different orbital regimes',
            unit: 'log(Days)',
            range: '-0.3 - 3.0+ log(Days)',
            significance: 'Statistical normalization for better model convergence'
        }
    };

    return featureDetails[feature.feature] || {
        title: feature.feature.replace('koi_', '').replace(/_/g, ' ').toUpperCase(),
        description: 'Engineered feature for improved detection performance',
        impact: 'Contributes to model robustness and generalization',
        unit: 'Various units',
        range: 'Feature dependent',
        significance: 'Model performance enhancement'
    };
};

export const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#84CC16', '#F97316', '#0EA5E9'];