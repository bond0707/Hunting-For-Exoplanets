export const missionOptions = ['Kepler', 'TESS', 'K2', 'Other'];

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
                step: 0.01
            },
            {
                name: 'koi_fpflag_nt',
                label: 'Not Transit-Like Flag',
                placeholder: '0 or 1',
                type: 'select',
                options: [
                    { value: 0, label: '0 - Transit-like' },
                    { value: 1, label: '1 - Not transit-like' }
                ]
            },
            {
                name: 'koi_fpflag_ss',
                label: 'Stellar Eclipse Flag',
                placeholder: '0 or 1',
                type: 'select',
                options: [
                    { value: 0, label: '0 - No stellar eclipse' },
                    { value: 1, label: '1 - Stellar eclipse detected' }
                ]
            },
            {
                name: 'koi_fpflag_co',
                label: 'Centroid Offset Flag',
                placeholder: '0 or 1',
                type: 'select',
                options: [
                    { value: 0, label: '0 - No centroid offset' },
                    { value: 1, label: '1 - Centroid offset detected' }
                ]
            },
            {
                name: 'koi_fpflag_ec',
                label: 'Ephemeris Match Flag',
                placeholder: '0 or 1',
                type: 'select',
                options: [
                    { value: 0, label: '0 - No ephemeris match' },
                    { value: 1, label: '1 - Ephemeris match detected' }
                ]
            },
            {
                name: 'koi_period',
                label: 'Orbital Period (days)',
                placeholder: 'e.g., 129.9',
                type: 'number',
                min: 0.1,
                max: 1000,
                step: 0.1
            },
            {
                name: 'koi_prad',
                label: 'Planet Radius (R⊕)',
                placeholder: 'e.g., 1.17',
                type: 'number',
                min: 0.1,
                max: 50,
                step: 0.01
            },
            {
                name: 'koi_teq',
                label: 'Planet Temperature (K)',
                placeholder: 'e.g., 188',
                type: 'number',
                min: 50,
                max: 5000,
                step: 1
            },
            {
                name: 'koi_depth',
                label: 'Transit Depth (ppm)',
                placeholder: 'e.g., 430',
                type: 'number',
                min: 1,
                max: 100000,
                step: 1
            },
            {
                name: 'koi_duration',
                label: 'Transit Duration (hours)',
                placeholder: 'e.g., 5.3',
                type: 'number',
                min: 0.1,
                max: 48,
                step: 0.1
            },
            {
                name: 'koi_impact',
                label: 'Impact Parameter',
                placeholder: 'e.g., 0.5',
                type: 'number',
                min: 0,
                max: 1,
                step: 0.01
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
                step: 0.01
            },
            {
                name: 'pl_rade',
                label: 'Planet Radius (R⊕)',
                placeholder: 'e.g., 1.88',
                type: 'number',
                min: 0.1,
                max: 30,
                step: 0.01
            },
            {
                name: 'pl_eqt',
                label: 'Planet Temperature (K)',
                placeholder: 'e.g., 2000',
                type: 'number',
                min: 50,
                max: 5000,
                step: 1
            },
            {
                name: 'st_rad',
                label: 'Stellar Radius (R☉)',
                placeholder: 'e.g., 0.94',
                type: 'number',
                min: 0.1,
                max: 10,
                step: 0.01
            },
            {
                name: 'st_teff',
                label: 'Stellar Temperature (K)',
                placeholder: 'e.g., 5196',
                type: 'number',
                min: 2000,
                max: 10000,
                step: 1
            },
            {
                name: 'st_logg',
                label: 'Stellar Surface Gravity (log cm/s²)',
                placeholder: 'e.g., 4.3',
                type: 'number',
                min: 3.5,
                max: 5.5,
                step: 0.1
            },
            {
                name: 'pl_trandep',
                label: 'Transit Depth (ppm)',
                placeholder: 'e.g., 370',
                type: 'number',
                min: 1,
                max: 50000,
                step: 1
            },
            {
                name: 'pl_trandurh',
                label: 'Transit Duration (hours)',
                placeholder: 'e.g., 1.8',
                type: 'number',
                min: 0.1,
                max: 24,
                step: 0.1
            },
            {
                name: 'st_tmag',
                label: 'TESS Magnitude',
                placeholder: 'e.g., 10.5',
                type: 'number',
                min: 0,
                max: 20,
                step: 0.1
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
                step: 0.1
            },
            {
                name: 'pl_rade',
                label: 'Planet Radius (R⊕)',
                placeholder: 'e.g., 2.34',
                type: 'number',
                min: 0.1,
                max: 20,
                step: 0.01
            },
            {
                name: 'pl_eqt',
                label: 'Planet Temperature (K)',
                placeholder: 'e.g., 320',
                type: 'number',
                min: 50,
                max: 3000,
                step: 1
            },
            {
                name: 'st_rad',
                label: 'Stellar Radius (R☉)',
                placeholder: 'e.g., 0.78',
                type: 'number',
                min: 0.1,
                max: 5,
                step: 0.01
            },
            {
                name: 'st_teff',
                label: 'Stellar Temperature (K)',
                placeholder: 'e.g., 4500',
                type: 'number',
                min: 2500,
                max: 8000,
                step: 1
            },
            {
                name: 'st_logg',
                label: 'Stellar Surface Gravity (log cm/s²)',
                placeholder: 'e.g., 4.5',
                type: 'number',
                min: 3.5,
                max: 5.0,
                step: 0.1
            },
            {
                name: 'pl_trandep',
                label: 'Transit Depth (ppm)',
                placeholder: 'e.g., 280',
                type: 'number',
                min: 1,
                max: 10000,
                step: 1
            },
            {
                name: 'pl_trandur',
                label: 'Transit Duration (hours)',
                placeholder: 'e.g., 3.1',
                type: 'number',
                min: 0.1,
                max: 12,
                step: 0.1
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
                step: 0.1
            },
            {
                name: 'planet_radius',
                label: 'Planet Radius (R⊕)',
                placeholder: 'e.g., 0.95',
                type: 'number',
                min: 0.1,
                max: 50,
                step: 0.01
            },
            {
                name: 'planet_temp',
                label: 'Planet Temperature (K)',
                placeholder: 'e.g., 245',
                type: 'number',
                min: 50,
                max: 5000,
                step: 1
            },
            {
                name: 'stellar_radius',
                label: 'Stellar Radius (R☉)',
                placeholder: 'e.g., 0.61',
                type: 'number',
                min: 0.1,
                max: 10,
                step: 0.01
            },
            {
                name: 'stellar_temp',
                label: 'Stellar Temperature (K)',
                placeholder: 'e.g., 3900',
                type: 'number',
                min: 2000,
                max: 10000,
                step: 1
            },
            {
                name: 'stellar_logg',
                label: 'Stellar Surface Gravity (log cm/s²)',
                placeholder: 'e.g., 4.6',
                type: 'number',
                min: 3.5,
                max: 5.5,
                step: 0.1
            }
        ]
    }
};

export const missionSamples = {
    Kepler: [
        {
            name: "Confirmed Kepler Exoplanet - Small Rocky World",
            data: { koi_score: 0.95, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 0.893, koi_prad: 1.47, koi_teq: 973, koi_depth: 738, koi_duration: 1.19, koi_impact: 0.3 }
        },
        {
            name: "Kepler-22 b (K00854.01)",
            data: { koi_score: 1.000, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 289.862, koi_prad: 2.10, koi_teq: 262, koi_depth: 425.3, koi_duration: 6.95, koi_impact: 0.831 }
        },
        {
            name: "Kepler-186 f (K03138.05)",
            data: { koi_score: 0.963, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 129.944, koi_prad: 1.17, koi_teq: 188, koi_depth: 110.1, koi_duration: 4.88, koi_impact: 0.768 }
        },
        {
            name: "Kepler-62 f (K00701.05)",
            data: { koi_score: 0.999, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 267.291, koi_prad: 1.54, koi_teq: 208, koi_depth: 219.9, koi_duration: 7.72, koi_impact: 0.700 }
        },
        {
            name: "Kepler-452 b (K07030.01)",
            data: { koi_score: 1.000, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 384.843, koi_prad: 1.59, koi_teq: 265, koi_depth: 201.7, koi_duration: 10.59, koi_impact: 0.698 }
        },
        {
            name: "Kepler-11 f (K00157.05)",
            data: { koi_score: 1.000, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 46.689, koi_prad: 2.49, koi_teq: 421, koi_depth: 708.8, koi_duration: 6.00, koi_impact: 0.170 }
        },
        {
            name: "FP: K00010.02",
            data: { koi_score: 0.000, koi_fpflag_nt: 1, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 3.522, koi_prad: 47.92, koi_teq: 1403, koi_depth: 80932.1, koi_duration: 2.33, koi_impact: 1.021 }
        },
        {
            name: "FP: K00075.02",
            data: { koi_score: 0.000, koi_fpflag_nt: 1, koi_fpflag_ss: 1, koi_fpflag_co: 1, koi_fpflag_ec: 1, koi_period: 14.215, koi_prad: 32.22, koi_teq: 772, koi_depth: 298490.0, koi_duration: 1.76, koi_impact: 0.906 }
        },
        {
            name: "FP: K00115.03",
            data: { koi_score: 0.000, koi_fpflag_nt: 1, koi_fpflag_ss: 1, koi_fpflag_co: 1, koi_fpflag_ec: 0, koi_period: 2.505, koi_prad: 1.13, koi_teq: 1395, koi_depth: 172.5, koi_duration: 3.32, koi_impact: 1.258 }
        },
        {
            name: "FP: K00112.02",
            data: { koi_score: 0.000, koi_fpflag_nt: 1, koi_fpflag_ss: 1, koi_fpflag_co: 1, koi_fpflag_ec: 1, koi_period: 15.159, koi_prad: 2.11, koi_teq: 737, koi_depth: 770.2, koi_duration: 4.88, koi_impact: 1.229 }
        },
        {
            name: "FP: K00001.02",
            data: { koi_score: 0.000, koi_fpflag_nt: 1, koi_fpflag_ss: 1, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 0.837, koi_prad: 2.18, koi_teq: 2268, koi_depth: 379.8, koi_duration: 2.21, koi_impact: 0.899 }
        }
    ],
    TESS: [
        {
            name: "Confirmed TESS Exoplanet - Hot Jupiter",
            data: { pl_orbper: 3.579, pl_rade: 10.93, pl_eqt: 1189, st_rad: 1.039, st_teff: 5731, st_logg: 4.4, pl_trandep: 11445, pl_trandurh: 2.90, st_tmag: 9.8 }
        },
        {
            name: "TOI-178 b",
            data: { pl_orbper: 1.954, pl_rade: 1.18, pl_eqt: 871, st_rad: 0.655, st_teff: 4323, st_logg: 4.65, pl_trandep: 3456.9, pl_trandurh: 1.25, st_tmag: 11.23 }
        },
        {
            name: "TOI-700 d",
            data: { pl_orbper: 37.424, pl_rade: 1.07, pl_eqt: 295, st_rad: 0.419, st_teff: 3496, st_logg: 4.89, pl_trandep: 742.0, pl_trandurh: 2.53, st_tmag: 12.39 }
        },
        {
            name: "LHS 3844 b",
            data: { pl_orbper: 0.462, pl_rade: 1.30, pl_eqt: 805, st_rad: 0.189, st_teff: 3036, st_logg: 5.21, pl_trandep: 5120.0, pl_trandurh: 1.28, st_tmag: 14.15 }
        },
        {
            name: "Pi Mensae c",
            data: { pl_orbper: 6.268, pl_rade: 2.06, pl_eqt: 1027, st_rad: 1.09, st_teff: 6037, st_logg: 4.41, pl_trandep: 370.0, pl_trandurh: 2.87, st_tmag: 5.34 }
        },
        {
            name: "TOI-1338 b",
            data: { pl_orbper: 95.174, pl_rade: 6.34, pl_eqt: 300, st_rad: 1.30, st_teff: 6019, st_logg: 4.26, pl_trandep: 4684.0, pl_trandurh: 6.84, st_tmag: 11.27 }
        },
        {
            name: "FP: TOI-143.01",
            data: { pl_orbper: 2.229, pl_rade: 10.36, pl_eqt: 1324, st_rad: 0.86, st_teff: 5540, st_logg: 4.54, pl_trandep: 15306.0, pl_trandurh: 2.12, st_tmag: 10.38 }
        },
        {
            name: "FP: TOI-135.01",
            data: { pl_orbper: 5.867, pl_rade: 13.56, pl_eqt: 1056, st_rad: 1.10, st_teff: 6010, st_logg: 4.38, pl_trandep: 15998.0, pl_trandurh: 4.21, st_tmag: 9.88 }
        },
        {
            name: "FP: TOI-472.01",
            data: { pl_orbper: 1.056, pl_rade: 34.34, pl_eqt: 2191, st_rad: 1.63, st_teff: 6100, st_logg: 4.04, pl_trandep: 57900.0, pl_trandurh: 3.57, st_tmag: 10.19 }
        },
        {
            name: "FP: TOI-1140.01",
            data: { pl_orbper: 0.919, pl_rade: 14.33, pl_eqt: 2351, st_rad: 2.05, st_teff: 8303, st_logg: 4.14, pl_trandep: 5122.0, pl_trandurh: 4.56, st_tmag: 9.94 }
        },
        {
            name: "FP: TOI-1273.01",
            data: { pl_orbper: 1.255, pl_rade: 24.31, pl_eqt: 1618, st_rad: 1.14, st_teff: 5313, st_logg: 3.86, pl_trandep: 50740.0, pl_trandurh: 2.80, st_tmag: 11.85 }
        }
    ],
    K2: [
        {
            name: "Confirmed K2 Exoplanet - Super Earth",
            data: { pl_orbper: 15.2, pl_rade: 2.34, pl_eqt: 320, st_rad: 0.78, st_teff: 4500, st_logg: 4.5, pl_trandep: 280, pl_trandur: 3.1 }
        },
        {
            name: "K2-18 b",
            data: { pl_orbper: 32.939, pl_rade: 2.61, pl_eqt: 265, st_rad: 0.45, st_teff: 3457, st_logg: 4.86, pl_trandep: 3213.9, pl_trandur: 2.68 }
        },
        {
            name: "K2-3 d",
            data: { pl_orbper: 44.556, pl_rade: 1.55, pl_eqt: 279, st_rad: 0.49, st_teff: 3820, st_logg: 4.80, pl_trandep: 960.0, pl_trandur: 2.60 }
        },
        {
            name: "TRAPPIST-1 e",
            data: { pl_orbper: 6.099, pl_rade: 0.92, pl_eqt: 251, st_rad: 0.12, st_teff: 2566, st_logg: 5.24, pl_trandep: 5549.0, pl_trandur: 0.81 }
        },
        {
            name: "K2-72 e",
            data: { pl_orbper: 24.166, pl_rade: 1.25, pl_eqt: 289, st_rad: 0.27, st_teff: 3373, st_logg: 5.05, pl_trandep: 2100.0, pl_trandur: 1.63 }
        },
        {
            name: "K2-138 b",
            data: { pl_orbper: 2.353, pl_rade: 1.51, pl_eqt: 1202, st_rad: 0.94, st_teff: 5410, st_logg: 4.49, pl_trandep: 279.0, pl_trandur: 2.22 }
        },
        {
            name: "FP: EPIC 201367065.01",
            data: { pl_orbper: 8.583, pl_rade: 27.68, pl_eqt: 878, st_rad: 1.09, st_teff: 5790, st_logg: 4.43, pl_trandep: 694000.0, pl_trandur: 3.69 }
        },
        {
            name: "FP: EPIC 201563164.01",
            data: { pl_orbper: 0.781, pl_rade: 13.92, pl_eqt: 2010, st_rad: 1.10, st_teff: 5800, st_logg: 4.39, pl_trandep: 168000.0, pl_trandur: 2.05 }
        },
        {
            name: "FP: EPIC 201822911.01",
            data: { pl_orbper: 2.853, pl_rade: 41.67, pl_eqt: 2011, st_rad: 2.45, st_teff: 8300, st_logg: 4.10, pl_trandep: 310000.0, pl_trandur: 5.25 }
        },
        {
            name: "FP: EPIC 203533423.01",
            data: { pl_orbper: 1.057, pl_rade: 17.51, pl_eqt: 1819, st_rad: 1.18, st_teff: 6010, st_logg: 4.37, pl_trandep: 243000.0, pl_trandur: 3.33 }
        },
        {
            name: "FP: EPIC 211993241.01",
            data: { pl_orbper: 10.707, pl_rade: 21.03, pl_eqt: 765, st_rad: 1.10, st_teff: 5630, st_logg: 4.40, pl_trandep: 379000.0, pl_trandur: 3.99 }
        }
    ],
    Other: [
        {
            name: "Generic Exoplanet Candidate",
            data: { period: 45.6, planet_radius: 0.95, planet_temp: 245, stellar_radius: 0.61, stellar_temp: 3900, stellar_logg: 4.6 }
        },
        {
            name: "Kepler-20 f (K00116.03)",
            data: { period: 19.577, planet_radius: 1.00, planet_temp: 705, stellar_radius: 0.95, stellar_temp: 5495, stellar_logg: 4.46 }
        },
        {
            name: "Kepler-69 c (K00284.02)",
            data: { period: 242.473, planet_radius: 1.54, planet_temp: 299, stellar_radius: 0.93, stellar_temp: 5638, stellar_logg: 4.49 }
        },
        {
            name: "Kepler-7 b (K00108.01)",
            data: { period: 4.885, planet_radius: 16.51, planet_temp: 1540, stellar_radius: 2.01, stellar_temp: 5933, stellar_logg: 3.96 }
        },
        {
            name: "Kepler-47 c (K06925.02)",
            data: { period: 303.222, planet_radius: 4.42, planet_temp: 169, stellar_radius: 0.95, stellar_temp: 5638, stellar_logg: 4.43 }
        },
        {
            name: "Kepler-16 b (K01647.01)",
            data: { period: 228.778, planet_radius: 8.13, planet_temp: 188, stellar_radius: 0.65, stellar_temp: 4450, stellar_logg: 4.66 }
        },
        {
            name: "FP: K00002.02",
            data: { period: 2.470, planet_radius: 26.65, planet_temp: 1650, stellar_radius: 0.98, stellar_temp: 5780, stellar_logg: 4.56 }
        },
        {
            name: "FP: K00011.02",
            data: { period: 118.384, planet_radius: 25.04, planet_temp: 379, stellar_radius: 0.87, stellar_temp: 5202, stellar_logg: 4.58 }
        },
        {
            name: "FP: K00140.01",
            data: { period: 3.018, planet_radius: 24.26, planet_temp: 1546, stellar_radius: 1.20, stellar_temp: 6185, stellar_logg: 4.38 }
        },
        {
            name: "FP: K00198.01",
            data: { period: 0.999, planet_radius: 26.04, planet_temp: 2360, stellar_radius: 1.57, stellar_temp: 8378, stellar_logg: 4.13 }
        },
        {
            name: "FP: K00254.02",
            data: { period: 3.125, planet_radius: 36.65, planet_temp: 1583, stellar_radius: 1.15, stellar_temp: 5792, stellar_logg: 4.20 }
        }
    ]
};