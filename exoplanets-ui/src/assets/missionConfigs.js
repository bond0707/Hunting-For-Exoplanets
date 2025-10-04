export const missionConfigs = {
    Kepler: {
        backendName: 'kepler',
        features: [
            {
                name: 'koi_score',
                label: 'KOI Score',
                placeholder: '0.0-1.0',
                type: 'number',
                min: 0,
                max: 1,
                step: 0.01,
                errorMessage: 'Must be between 0 and 1'
            },
            {
                name: 'koi_fpflag_nt',
                label: 'Not Transit-Like Flag',
                placeholder: '0 or 1',
                type: 'select',
                options: [
                    { value: 0, label: '0 - Transit-like' },
                    { value: 1, label: '1 - Not transit-like' }
                ],
                errorMessage: 'Must be 0 or 1'
            },
            {
                name: 'koi_fpflag_ss',
                label: 'Stellar Eclipse Flag',
                placeholder: '0 or 1',
                type: 'select',
                options: [
                    { value: 0, label: '0 - No stellar eclipse' },
                    { value: 1, label: '1 - Stellar eclipse detected' }
                ],
                errorMessage: 'Must be 0 or 1'
            },
            {
                name: 'koi_fpflag_co',
                label: 'Centroid Offset Flag',
                placeholder: '0 or 1',
                type: 'select',
                options: [
                    { value: 0, label: '0 - No centroid offset' },
                    { value: 1, label: '1 - Centroid offset detected' }
                ],
                errorMessage: 'Must be 0 or 1'
            },
            {
                name: 'koi_fpflag_ec',
                label: 'Ephemeris Match Flag',
                placeholder: '0 or 1',
                type: 'select',
                options: [
                    { value: 0, label: '0 - No ephemeris match' },
                    { value: 1, label: '1 - Ephemeris match detected' }
                ],
                errorMessage: 'Must be 0 or 1'
            },
            {
                name: 'koi_period',
                label: 'Orbital Period (days)',
                placeholder: 'e.g., 129.9',
                type: 'number',
                min: 0.1,
                max: 1000,
                errorMessage: 'Must be between 0.1 and 1000 days'
            },
            {
                name: 'koi_prad',
                label: 'Planet Radius (R⊕)',
                placeholder: 'e.g., 1.17',
                type: 'number',
                min: 0.1,
                max: 50,
                step: 0.01,
                errorMessage: 'Must be between 0.1 and 50 Earth radii'
            },
            {
                name: 'koi_teq',
                label: 'Planet Temperature (K)',
                placeholder: 'e.g., 188',
                type: 'number',
                min: 50,
                max: 5000,
                step: 1,
                errorMessage: 'Must be between 50K and 5000K'
            },
            {
                name: 'koi_depth',
                label: 'Transit Depth (ppm)',
                placeholder: 'e.g., 430',
                type: 'number',
                min: 1,
                max: 100000,
                step: 1,
                errorMessage: 'Must be between 1 and 100,000 ppm'
            },
            {
                name: 'koi_duration',
                label: 'Transit Duration (hours)',
                placeholder: 'e.g., 5.3',
                type: 'number',
                min: 0.1,
                max: 48,
                step: 0.1,
                errorMessage: 'Must be between 0.1 and 48 hours'
            },
            {
                name: 'koi_impact',
                label: 'Impact Parameter',
                placeholder: 'e.g., 0.5',
                type: 'number',
                min: 0,
                max: 1,
                step: 0.01,
                errorMessage: 'Must be between 0 and 1'
            }
        ]
    },
    TESS: {
        backendName: 'tess',
        features: [
            {
                name: 'pl_orbper',
                label: 'Orbital Period (days)',
                placeholder: 'e.g., 0.73',
                type: 'number',
                min: 0.1,
                max: 500,
                step: 0.01,
                errorMessage: 'Must be between 0.1 and 500 days'
            },
            {
                name: 'pl_rade',
                label: 'Planet Radius (R⊕)',
                placeholder: 'e.g., 1.88',
                type: 'number',
                min: 0.1,
                max: 30,
                step: 0.01,
                errorMessage: 'Must be between 0.1 and 30 Earth radii'
            },
            {
                name: 'pl_eqt',
                label: 'Planet Temperature (K)',
                placeholder: 'e.g., 2000',
                type: 'number',
                min: 50,
                max: 5000,
                step: 1,
                errorMessage: 'Must be between 50K and 5000K'
            },
            {
                name: 'st_rad',
                label: 'Stellar Radius (R☉)',
                placeholder: 'e.g., 0.94',
                type: 'number',
                min: 0.1,
                max: 10,
                step: 0.01,
                errorMessage: 'Must be between 0.1 and 10 Solar radii'
            },
            {
                name: 'st_teff',
                label: 'Stellar Temperature (K)',
                placeholder: 'e.g., 5196',
                type: 'number',
                min: 2000,
                max: 10000,
                step: 1,
                errorMessage: 'Must be between 2000K and 10000K'
            },
            {
                name: 'st_logg',
                label: 'Stellar Surface Gravity (log cm/s²)',
                placeholder: 'e.g., 4.3',
                type: 'number',
                min: 3.5,
                max: 5.5,
                step: 0.1,
                errorMessage: 'Must be between 3.5 and 5.5 log cm/s²'
            },
            {
                name: 'pl_trandep',
                label: 'Transit Depth (ppm)',
                placeholder: 'e.g., 370',
                type: 'number',
                min: 1,
                max: 50000,
                step: 1,
                errorMessage: 'Must be between 1 and 50,000 ppm'
            },
            {
                name: 'pl_trandurh',
                label: 'Transit Duration (hours)',
                placeholder: 'e.g., 1.8',
                type: 'number',
                min: 0.1,
                max: 24,
                step: 0.1,
                errorMessage: 'Must be between 0.1 and 24 hours'
            },
            {
                name: 'st_tmag',
                label: 'TESS Magnitude',
                placeholder: 'e.g., 10.5',
                type: 'number',
                min: 0,
                max: 20,
                step: 0.1,
                errorMessage: 'Must be between 0 and 20'
            }
        ]
    },
    K2: {
        backendName: 'k2',
        features: [
            {
                name: 'pl_orbper',
                label: 'Orbital Period (days)',
                placeholder: 'e.g., 15.2',
                type: 'number',
                min: 0.1,
                max: 100,
                step: 0.1,
                errorMessage: 'Must be between 0.1 and 100 days'
            },
            {
                name: 'pl_rade',
                label: 'Planet Radius (R⊕)',
                placeholder: 'e.g., 2.34',
                type: 'number',
                min: 0.1,
                max: 20,
                step: 0.01,
                errorMessage: 'Must be between 0.1 and 20 Earth radii'
            },
            {
                name: 'pl_eqt',
                label: 'Planet Temperature (K)',
                placeholder: 'e.g., 320',
                type: 'number',
                min: 50,
                max: 3000,
                step: 1,
                errorMessage: 'Must be between 50K and 3000K'
            },
            {
                name: 'st_rad',
                label: 'Stellar Radius (R☉)',
                placeholder: 'e.g., 0.78',
                type: 'number',
                min: 0.1,
                max: 5,
                step: 0.01,
                errorMessage: 'Must be between 0.1 and 5 Solar radii'
            },
            {
                name: 'st_teff',
                label: 'Stellar Temperature (K)',
                placeholder: 'e.g., 4500',
                type: 'number',
                min: 2500,
                max: 8000,
                step: 1,
                errorMessage: 'Must be between 2500K and 8000K'
            },
            {
                name: 'st_logg',
                label: 'Stellar Surface Gravity (log cm/s²)',
                placeholder: 'e.g., 4.5',
                type: 'number',
                min: 3.5,
                max: 5.0,
                step: 0.1,
                errorMessage: 'Must be between 3.5 and 5.0 log cm/s²'
            },
            {
                name: 'pl_trandep',
                label: 'Transit Depth (ppm)',
                placeholder: 'e.g., 280',
                type: 'number',
                min: 1,
                max: 10000,
                step: 1,
                errorMessage: 'Must be between 1 and 10,000 ppm'
            },
            {
                name: 'pl_trandur',
                label: 'Transit Duration (hours)',
                placeholder: 'e.g., 3.1',
                type: 'number',
                min: 0.1,
                max: 12,
                step: 0.1,
                errorMessage: 'Must be between 0.1 and 12 hours'
            }
        ]
    },
    Other: {
        backendName: 'other',
        features: [
            {
                name: 'period',
                label: 'Orbital Period (days)',
                placeholder: 'e.g., 45.6',
                type: 'number',
                min: 0.1,
                max: 1000,
                step: 0.1,
                errorMessage: 'Must be between 0.1 and 1000 days'
            },
            {
                name: 'planet_radius',
                label: 'Planet Radius (R⊕)',
                placeholder: 'e.g., 0.95',
                type: 'number',
                min: 0.1,
                max: 50,
                step: 0.01,
                errorMessage: 'Must be between 0.1 and 50 Earth radii'
            },
            {
                name: 'planet_temp',
                label: 'Planet Temperature (K)',
                placeholder: 'e.g., 245',
                type: 'number',
                min: 50,
                max: 5000,
                step: 1,
                errorMessage: 'Must be between 50K and 5000K'
            },
            {
                name: 'stellar_radius',
                label: 'Stellar Radius (R☉)',
                placeholder: 'e.g., 0.61',
                type: 'number',
                min: 0.1,
                max: 10,
                step: 0.01,
                errorMessage: 'Must be between 0.1 and 10 Solar radii'
            },
            {
                name: 'stellar_temp',
                label: 'Stellar Temperature (K)',
                placeholder: 'e.g., 3900',
                type: 'number',
                min: 2000,
                max: 10000,
                step: 1,
                errorMessage: 'Must be between 2000K and 10000K'
            },
            {
                name: 'stellar_logg',
                label: 'Stellar Surface Gravity (log cm/s²)',
                placeholder: 'e.g., 4.6',
                type: 'number',
                min: 3.5,
                max: 5.5,
                step: 0.1,
                errorMessage: 'Must be between 3.5 and 5.5 log cm/s²'
            }
        ]
    }
};