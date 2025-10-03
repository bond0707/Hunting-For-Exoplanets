// src/assets/featureDetails.js

export const getFeatureDetails = (feature) => {
    if (!feature || !feature.feature) {
        return { title: 'Select a Feature', description: 'Click a bar to see details.', impact: 'N/A', unit: 'N/A', range: 'N/A', significance: 'N/A' };
    }

    const details = {
        // Universal
        'period': { title: 'Orbital Period', unit: 'Days', description: 'Time a planet takes to complete one orbit.', significance: 'Fundamental for determining orbital distance and transit probability.', impact: 'A core predictor of planetary systems.' , range: '0.5 - 1000+' },
        'planet_radius': { title: 'Planet Radius', unit: 'Earth Radii (R⊕)', description: 'The physical size of the planet.', significance: 'Helps determine if a planet could be terrestrial and potentially habitable.', impact: 'One of the most powerful features for identifying exoplanets.', range: '0.5 - 30+' },
        'planet_temp': { title: 'Equilibrium Temperature', unit: 'Kelvin (K)', description: 'Theoretical surface temperature of the planet from stellar radiation.', significance: 'Critical for assessing the Habitable Zone and potential for liquid water.', impact: 'Strongly influences habitability predictions.', range: '100 - 3000+' },
        'stellar_radius': { title: 'Stellar Radius', unit: 'Solar Radii (R☉)', description: 'The size of the host star, used to calculate the planet\'s true size.', significance: 'Essential for accurate planet characterization.', impact: 'Provides context for all planetary parameters.', range: '0.1 - 10+' },
        'stellar_temp': { title: 'Stellar Temperature', unit: 'Kelvin (K)', description: 'The surface temperature of the host star.', significance: 'Determines the energy radiated towards its planets.', impact: 'Directly affects planet temperature and habitable zone.', range: '2,500 - 10,000+' },
        'stellar_logg': { title: 'Stellar Surface Gravity', unit: 'log(cm/s²)', description: 'Gravitational acceleration at the star\'s surface, indicating its age.', significance: 'Distinguishes main-sequence stars from giants, helping rule out false positives.', impact: 'A key contextual feature for stellar classification.', range: '3.5 - 5.0' },

        // Kepler
        'koi_score': { title: 'KOI Score', unit: 'Score (0-1)', description: 'Confidence score from the Kepler pipeline that the signal is a real planet.', significance: 'A powerful, pre-processed feature summarizing signal quality.', impact: 'Very high predictive power in the Kepler specialist model.', range: '0.0 - 1.0' },
        'koi_fpflag_nt': { title: 'Not Transit-Like Flag', unit: 'Flag (0 or 1)', description: 'Flagged if the signal shape is not like a typical planetary transit.', significance: 'Strong indicator of a non-planetary source, like starspots.', impact: 'Effectively filters many common false positives.', range: '0 or 1' },
        'koi_fpflag_ss': { title: 'Stellar Eclipse Flag', unit: 'Flag (0 or 1)', description: 'Flagged if the signal is likely caused by an eclipsing binary star.', significance: 'Differentiates between a transiting planet and a companion star.', impact: 'Crucial for eliminating stellar-based false positives.', range: '0 or 1' },
        'koi_fpflag_co': { title: 'Centroid Offset Flag', unit: 'Flag (0 or 1)', description: 'Flagged if the signal source is offset from the target star\'s location.', significance: 'A very strong indicator of a background eclipsing binary.', impact: 'One of the most effective features for rejecting false positives.', range: '0 or 1' },
        'koi_fpflag_ec': { title: 'Ephemeris Match Flag', unit: 'Flag (0 or 1)', description: 'Flagged if the signal matches another known variable source.', significance: 'Helps identify signals from already-catalogued variable stars.', impact: 'Filters out known contaminants.', range: '0 or 1' },
        'koi_depth': { title: 'Transit Depth', unit: 'ppm', description: 'Percentage of the star\'s light blocked during the transit.', significance: 'Directly related to the ratio of the planet\'s size to the star\'s size.', impact: 'A primary measurement for determining planet radius.', range: '10 - 100,000' },
        'koi_duration': { title: 'Transit Duration', unit: 'Hours', description: 'The total time the planet spends crossing its star.', significance: 'Depends on the planet\'s orbital speed and the star\'s diameter.', impact: 'Helps constrain the orbital geometry.', range: '0.5 - 24' },
        'koi_impact': { title: 'Impact Parameter', unit: 'Stellar Radii', description: 'Projected distance between the star and planet centers during transit.', significance: 'A value of 0 is a central transit; helps constrain orbital inclination.', impact: 'Helps refine the transit model and confirm the signal.', range: '0.0 - 1.0' },

        // TESS/K2
        'st_tmag': { title: 'TESS Magnitude', unit: 'Magnitude', description: 'The brightness of the star as seen by the TESS instrument.', significance: 'Brighter stars provide higher quality data and more reliable detections.', impact: 'Influences the signal-to-noise ratio.', range: '4 - 16' },
        'pl_trandep': { title: 'Transit Depth (TESS/K2)', unit: 'ppm / %', description: 'The transit depth as measured by the TESS or K2 missions.', significance: 'Directly related to the ratio of the planet\'s size to the star\'s size.', impact: 'Primary measurement for determining planet radius.', range: '10 - 50,000' },
        'pl_trandurh': { title: 'Transit Duration (TESS)', unit: 'Hours', description: 'The duration of the transit, in hours, as measured by TESS.', significance: 'Depends on orbital speed and stellar diameter.', impact: 'Helps constrain orbital parameters.', range: '0.5 - 12' },
        'pl_trandur': { title: 'Transit Duration (K2)', unit: 'Hours', description: 'The duration of the transit, in hours, as measured by K2.', significance: 'Depends on orbital speed and stellar diameter.', impact: 'Helps constrain orbital parameters.', range: '0.5 - 12' },

        // Engineered
        'depth_over_duration': { title: 'Depth/Duration Ratio', unit: 'Ratio', description: 'Engineered feature combining transit depth and duration.', significance: 'Helps distinguish V-shaped eclipsing binary signals from U-shaped transits.', impact: 'Improves rejection of specific false positives.', range: 'Varies' },
        'radius_over_period': { title: 'Radius/Period Ratio', unit: 'Ratio', description: 'Engineered feature relating the planet\'s size to its orbital period.', significance: 'Can help identify unusual populations of planets.', impact: 'Provides a combined size-orbit context for the model.', range: 'Varies' },
    };

    const fallback = {
        title: feature.feature.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        description: 'A feature used by one of the specialist models for prediction.',
        impact: 'Contributes to the overall predictive power of the model.', unit: 'N/A', range: 'N/A', significance: 'Part of the model\'s feature set.'
    };

    return details[feature.feature] || fallback;
};

export const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#84CC16', '#F97316', '#0EA5E9'];