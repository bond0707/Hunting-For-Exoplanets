export const datasetInfo = {
    name: "Exoplanet Dataset",
    file: "kepler_tess_combined.csv",
    size: "9,564 astronomical observations",
    source: "NASA Exoplanet Archive + TESS",
    description: "Combined Kepler and TESS dataset for exoplanet detection model training.",
    keyFeatures: [
        { name: "koi_period", description: "Orbital period in days", category: "Orbital" },
        { name: "koi_prad", description: "Planet radius in Earth radii", category: "Planetary" },
        { name: "koi_teq", description: "Equilibrium temperature in Kelvin", category: "Environmental" },
        { name: "koi_steff", description: "Stellar effective temperature in Kelvin", category: "Stellar" },
        { name: "koi_srad", description: "Stellar radius in Solar radii", category: "Stellar" },
        { name: "koi_slogg", description: "Stellar surface gravity", category: "Stellar" },
        { name: "koi_insol", description: "Insolation flux relative to Earth", category: "Environmental" }
    ],
    dispositionStats: [
        { name: "Confirmed Exoplanets", count: 4781, percentage: 50.0, color: "#10B981" },
        { name: "False Positives", count: 2874, percentage: 30.0, color: "#EF4444" },
        { name: "Candidates", count: 1909, percentage: 20.0, color: "#F59E0B" }
    ],
    missionInfo: {
        name: "Multi-Mission Training",
        years: "2009-2024",
        discoveries: "Over 6,000 combined exoplanets",
        goal: "Create robust cross-mission detection model",
        method: "Transit photometry + Machine Learning"
    }
};