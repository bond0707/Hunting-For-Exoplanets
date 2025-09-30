export const sampleExoplanets = [
    {
        name: "Kepler-186f (Earth-like)",
        isExoplanet: true,
        data: {
            koi_period: 129.9,
            koi_depth: 430,
            koi_prad: 1.17,
            koi_duration: 5.3,
            koi_srad: 0.52,
            koi_steff: 3755,
            koi_teq: 188,
            mission: "Kepler"
        }
    },
    {
        name: "TESS False Positive",
        isExoplanet: false,
        data: {
            koi_period: 0.73,
            koi_depth: 370,
            koi_prad: 1.88,
            koi_duration: 1.8,
            koi_srad: 0.94,
            koi_steff: 5196,
            koi_teq: 2000,
            mission: "TESS"
        }
    },
    {
        name: "Kepler-452b (Super Earth)",
        isExoplanet: true,
        data: {
            koi_period: 384.8,
            koi_depth: 160,
            koi_prad: 1.63,
            koi_duration: 14.7,
            koi_srad: 1.11,
            koi_steff: 5757,
            koi_teq: 265,
            mission: "Kepler"
        }
    },
    {
        name: "Hot Jupiter Candidate",
        isExoplanet: true,
        data: {
            koi_period: 3.2,
            koi_depth: 12500,
            koi_prad: 12.4,
            koi_duration: 2.9,
            koi_srad: 1.45,
            koi_steff: 6100,
            koi_teq: 1450,
            mission: "Kepler"
        }
    },
    {
        name: "Stellar Binary (False Positive)",
        isExoplanet: false,
        data: {
            koi_period: 1.25,
            koi_depth: 8500,
            koi_prad: 8.9,
            koi_duration: 1.1,
            koi_srad: 0.76,
            koi_steff: 4800,
            koi_teq: 3200,
            mission: "TESS"
        }
    }
];