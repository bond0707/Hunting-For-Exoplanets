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
    // https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+5+kepid,kepoi_name,kepler_name,koi_score,koi_fpflag_nt,koi_fpflag_ss,koi_fpflag_co,koi_fpflag_ec,koi_period,koi_prad,koi_teq,koi_depth,koi_duration,koi_impact+from+cumulative+where+koi_disposition=%27CONFIRMED%27+and+koi_score+!=+1.0&format=csv
    // https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+5+kepid,kepoi_name,kepler_name,koi_score,koi_fpflag_nt,koi_fpflag_ss,koi_fpflag_co,koi_fpflag_ec,koi_period,koi_prad,koi_teq,koi_depth,koi_duration,koi_impact+from+cumulative+where+koi_disposition=%27FALSE+POSITIVE%27+and+koi_score+!=+0.0&format=csv
    Kepler: [
        {
            name: "Kepler-227 c (K00752.02)",
            data: { koi_score: 0.969, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 54.4183827, koi_prad: 2.83, koi_teq: 443.0, koi_depth: 874.8, koi_duration: 4.507, koi_impact: 0.586 }
        },
        {
            name: "Kepler-228 b (K00756.03)",
            data: { koi_score: 0.992, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 2.56658897, koi_prad: 1.59, koi_teq: 1360.0, koi_depth: 226.5, koi_duration: 2.429, koi_impact: 0.755 }
        },
        {
            name: "Kepler-1 b (K00001.01)",
            data: { koi_score: 0.811, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 2.470613377, koi_prad: 13.04, koi_teq: 1339.0, koi_depth: 14230.9, koi_duration: 1.74319, koi_impact: 0.818 }
        },
        {
            name: "Kepler-8 b (K00010.01)",
            data: { koi_score: 0.998, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 3.522498429, koi_prad: 14.59, koi_teq: 1521.0, koi_depth: 9145.7, koi_duration: 3.19843, koi_impact: 0.631 }
        },
        {
            name: "Kepler-226 b (K00749.02)",
            data: { koi_score: 0.980, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 3.94105221, koi_prad: 1.7, koi_teq: 1018.0, koi_depth: 363.3, koi_duration: 2.5984, koi_impact: 0.226 }
        },
        {
            name: "FP: K00774.01",
            data: { koi_score: 0.014, koi_fpflag_nt: 0, koi_fpflag_ss: 1, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 7.442652004, koi_prad: 15.03, koi_teq: 967.0, koi_depth: 24446.2, koi_duration: 2.3078, koi_impact: 0.137 }
        },
        {
            name: "FP: K00799.01",
            data: { koi_score: 0.773, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 1, koi_fpflag_ec: 0, koi_period: 1.626630225, koi_prad: 32.43, koi_teq: 1547.0, koi_depth: 1620.6, koi_duration: 2.1145, koi_impact: 1.26 }
        },
        {
            name: "FP: K00805.01",
            data: { koi_score: 0.053, koi_fpflag_nt: 0, koi_fpflag_ss: 1, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 10.328035714, koi_prad: 13.28, koi_teq: 843.0, koi_depth: 16917.7, koi_duration: 7.7915, koi_impact: 0.281 }
        },
        {
            name: "FP: K00827.01",
            data: { koi_score: 0.037, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 1, koi_fpflag_ec: 0, koi_period: 5.97581754, koi_prad: 3.86, koi_teq: 1047.0, koi_depth: 962.4, koi_duration: 3.065, koi_impact: 0.941 }
        },
        {
            name: "FP: K00831.01",
            data: { koi_score: 0.006, koi_fpflag_nt: 0, koi_fpflag_ss: 1, koi_fpflag_co: 0, koi_fpflag_ec: 0, koi_period: 3.9043425, koi_prad: 12.28, koi_teq: 1104.0, koi_depth: 16228.4, koi_duration: 3.831, koi_impact: 0.709 }
        }
    ],
    // https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=SELECT+top+5+%27TOI+-%27||toi+as+name,pl_orbper,pl_rade,pl_eqt,st_rad,st_teff,st_logg,pl_trandep,pl_trandurh,st_tmag+FROM+toi+WHERE+tfopwg_disp=%27FP%27+OR+tfopwg_disp=%27FA%27&format=csv
    // https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=SELECT+top+5+%27TOI+-%27||toi+as+name,pl_orbper,pl_rade,pl_eqt,st_rad,st_teff,st_logg,pl_trandep,pl_trandurh,st_tmag+FROM+toi+WHERE+tfopwg_disp=%27CP%27&format=csv
    TESS: [
        {
            name: "TOI-1052.01",
            data: { pl_orbper: 9.139804, pl_rade: 3.0629855, pl_eqt: 1006.9932829, st_rad: 1.58, st_teff: 5958.2, st_logg: 4.34, pl_trandep: 358.4157801, pl_trandurh: 3.0912936, st_tmag: 9.0197 }
        },
        {
            name: "TOI-1054.01",
            data: { pl_orbper: 15.5077855, pl_rade: 2.43432, pl_eqt: 853, st_rad: 1.17, st_teff: 6122, st_logg: 4.30881, pl_trandep: 513, pl_trandurh: 4.565, st_tmag: 8.4362 }
        },
        {
            name: "TOI-1055.01",
            data: { pl_orbper: 17.4713078, pl_rade: 3.5766828, pl_eqt: 689.3568807, st_rad: 0.974669, st_teff: 5783.54, st_logg: 4.49925, pl_trandep: 1199.7541483, pl_trandurh: 4.4284819, st_tmag: 8.0888 }
        },
        {
            name: "TOI-1062.01",
            data: { pl_orbper: 4.1150576, pl_rade: 2.30057, pl_eqt: 826, st_rad: 0.89, st_teff: 5394, st_logg: 4.50942, pl_trandep: 487, pl_trandurh: 1.08, st_tmag: 9.478 }
        },
        {
            name: "TOI-1064.01",
            data: { pl_orbper: 6.4438657, pl_rade: 2.460344, pl_eqt: 712.2812841, st_rad: 0.737189, st_teff: 4803, st_logg: 4.52079, pl_trandep: 1121.9512275, pl_trandurh: 1.9309449, st_tmag: 10.0059 }
        },
        {
            name: "FP: TOI-1051.01",
            data: { pl_orbper: 21.701669, pl_rade: 2.3751494, pl_eqt: 685.2, st_rad: 1.56486, st_teff: 5625, st_logg: 4.438, pl_trandep: 211.6567325, pl_trandurh: 8.2676424, st_tmag: 7.1278 }
        },
        {
            name: "FP: TOI-1053.01",
            data: { pl_orbper: 5.742625, pl_rade: 13.088532, pl_eqt: null, st_rad: 3.86959, st_teff: 5664, st_logg: 3.26574, pl_trandep: 1105.760867, pl_trandurh: 2.860293, st_tmag: 8.8849 }
        },
        {
            name: "FP: TOI-1061.01",
            data: { pl_orbper: 0.540933, pl_rade: 2.28501, pl_eqt: null, st_rad: 1.21935, st_teff: 5525, st_logg: 4.25342, pl_trandep: 257.347459, pl_trandurh: 1.674337, st_tmag: 9.7345 }
        },
        {
            name: "FP: TOI-1070.01",
            data: { pl_orbper: 2.9776152, pl_rade: 26.88423, pl_eqt: 1386.5, st_rad: 1.28, st_teff: 5740, st_logg: 4.29219, pl_trandep: 43218.111683, pl_trandurh: 3.25697, st_tmag: 15.7114 }
        },
        {
            name: "FP: TOI-1072.01",
            data: { pl_orbper: 12.8379689, pl_rade: 25.4886382, pl_eqt: 1225, st_rad: 2.4494, st_teff: 5765, st_logg: 4.34773, pl_trandep: 10539.0192794, pl_trandurh: 9.8464123, st_tmag: 11.7106 }
        }
    ],
    // https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+5+epic_candname,epic_hostname,k2_name,pl_orbper,pl_rade,pl_eqt,st_rad,st_teff,st_logg,pl_trandep,pl_trandur+from+k2pandc+where+k2_name+is+not+null+and+pl_orbper+is+not+null+and+pl_rade+is+not+null+and+pl_eqt+is+not+null+and+st_rad+is+not+null+and+st_teff+is+not+null+and+st_logg+is+not+null+and+pl_trandep+is+not+null+and+pl_trandur+is+not+null&format=csv
    // https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+5+epic_candname,epic_hostname,k2_name,pl_orbper,pl_rade,pl_eqt,st_rad,st_teff,st_logg,pl_trandep,pl_trandur+from+k2pandc+where+k2_name+is+null+and+pl_orbper+is+not+null+and+pl_rade+is+not+null+and+pl_eqt+is+not+null+and+st_rad+is+not+null+and+st_teff+is+not+null+and+st_logg+is+not+null+and+pl_trandep+is+not+null+and+pl_trandur+is+not+null&format=csv
    K2: [
        {
            name: "K2-232 b",
            data: { pl_orbper: 11.168459, pl_rade: 11.859122, pl_eqt: 1001.0, st_rad: 1.233, st_teff: 5888.0, st_logg: 4.273, pl_trandep: 0.7764, pl_trandur: 5.03016 }
        },
        {
            name: "K2-237 b",
            data: { pl_orbper: 2.18053332, pl_rade: 16.06246934, pl_eqt: 1759.0, st_rad: 1.236, st_teff: 6180.0, st_logg: 4.353, pl_trandep: 1.416, pl_trandur: 2.92728 }
        },
        {
            name: "K2-145 b",
            data: { pl_orbper: 4.1752387, pl_rade: 13.843115, pl_eqt: 1356.0, st_rad: 1.155, st_teff: 6149.0, st_logg: 4.4, pl_trandep: 1.4, pl_trandur: 3.46272 }
        },
        {
            name: "K2-143 b",
            data: { pl_orbper: 3.6191613, pl_rade: 16.92559, pl_eqt: 1637.0, st_rad: 1.444, st_teff: 6060.0, st_logg: 4.118, pl_trandep: 1.18, pl_trandur: 4.3656 }
        },
        {
            name: "K2-144 b",
            data: { pl_orbper: 3.142833, pl_rade: 15.13215, pl_eqt: 2097.0, st_rad: 2.21, st_teff: 6408.0, st_logg: 3.923, pl_trandep: 0.47, pl_trandur: 4.5576 }
        },
        {
            name: "FP: EPIC 211946007.01",
            data: { pl_orbper: 1.9828041248, pl_rade: 10.89107018, pl_eqt: 543.47, st_rad: 0.293047, st_teff: 3213.0, st_logg: 4.93347, pl_trandep: 13.21050435, pl_trandur: 1.1139386 }
        },
        {
            name: "FP: EPIC 219388192.01",
            data: { pl_orbper: 5.29136017752, pl_rade: 11.52204139, pl_eqt: 1027.17, st_rad: 1.03676, st_teff: 5555.0, st_logg: 4.39749, pl_trandep: 1.12532759, pl_trandur: 3.5122145 }
        },
        {
            name: "FP: EPIC 218621322.01",
            data: { pl_orbper: 11.5843558517, pl_rade: 5.49928933, pl_eqt: 651.38, st_rad: 1.09295, st_teff: 5631.0, st_logg: 4.36, pl_trandep: 0.2500558, pl_trandur: 3.4607621 }
        },
        {
            name: "FP: EPIC 220209578.01",
            data: { pl_orbper: 8.90003342005, pl_rade: 15.12617706, pl_eqt: 884.09, st_rad: 1.0044, st_teff: 5854.0, st_logg: 4.45956, pl_trandep: 2.21632826, pl_trandur: 1.8542477 }
        },
        {
            name: "FP: EPIC 220448185.01",
            data: { pl_orbper: 0.36432247904, pl_rade: 6.95273914, pl_eqt: 1086.47, st_rad: 0.347331, st_teff: 3473.0, st_logg: 4.87657, pl_trandep: 3.82167895, pl_trandur: 0.2120684 }
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