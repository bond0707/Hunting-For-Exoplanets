// src/assets/datasetInfo.js

export const datasetInfo = {
    name: "Exoplanet Archive: Multi-Mission Data",
    size: "14,000+",
    dispositionStats: [
        { name: 'Confirmed', count: 6241, percentage: 44, color: '#10B981' },
        { name: 'Candidate', count: 4890, percentage: 35, color: '#3B82F6' },
        { name: 'False Positive', count: 2983, percentage: 21, color: '#F59E0B' },
    ],
    keyFeatures: {
        universal: [
            { name: 'period', description: 'Time the planet takes to complete one orbit around its star.', category: 'Universal' },
            { name: 'planet_radius', description: 'The radius of the planet, measured in multiples of Earth\'s radius.', category: 'Universal' },
            { name: 'planet_temp', description: 'The equilibrium temperature of the planet as estimated from stellar radiation.', category: 'Universal' },
            { name: 'stellar_radius', description: 'The radius of the host star, measured in multiples of our Sun\'s radius.', category: 'Universal' },
            { name: 'stellar_temp', description: 'The effective temperature of the host star\'s surface.', category: 'Universal' },
            { name: 'stellar_logg', description: 'The gravitational acceleration on the star\'s surface (log g).', category: 'Universal' },
            // ADDED: The missing engineered feature
            { name: 'radius_over_period', description: 'Engineered feature: Ratio of planet radius to orbital period.', category: 'Universal' },
        ],
        kepler: [
            { name: 'koi_score', description: 'A value between 0 and 1 that indicates the confidence in the candidate.', category: 'Kepler' },
            { name: 'koi_fpflag_nt', description: 'Not Transit-Like Flag: Set if the transit shape is not as expected.', category: 'Kepler' },
            { name: 'koi_fpflag_ss', description: 'Stellar Eclipse Flag: Set if the signal is from a stellar companion.', category: 'Kepler' },
            // ADDED: The two missing Kepler flags
            { name: 'koi_fpflag_co', description: 'Centroid Offset Flag: Indicates a shift in the star\'s brightness center.', category: 'Kepler' },
            { name: 'koi_fpflag_ec', description: 'Ephemeris Match Flag: Indicates a match with a known eclipsing binary.', category: 'Kepler' },
            { name: 'koi_depth', description: 'The fraction of stellar flux lost during the transit.', category: 'Kepler' },
            { name: 'koi_duration', description: 'The duration of the observed transit event.', category: 'Kepler' },
            { name: 'koi_impact', description: 'The sky-projected distance between star and planet centers during transit.', category: 'Kepler' },
            // ADDED: The missing engineered feature
            { name: 'depth_over_duration', description: 'Engineered feature: Ratio of transit depth to duration.', category: 'Kepler' },
        ],
        tess: [
            { name: 'st_tmag', description: 'The brightness of the host star as measured by the TESS instrument.', category: 'TESS' },
            { name: 'pl_trandep', description: 'The transit depth of the planet signal, often measured in parts per million (ppm).', category: 'TESS' },
            { name: 'pl_trandurh', description: 'The transit duration in hours as measured by TESS.', category: 'TESS' },
        ],
        k2: [
            { name: 'pl_trandur', description: 'The transit duration in hours as measured by K2.', category: 'K2' },
            // REMOVED: 'k2_campaigns' was not used in the final model features.
        ],
    }
};