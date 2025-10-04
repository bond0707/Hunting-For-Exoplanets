// TO BE POPULATED LATER!!

export const missionSamples = {
    Kepler: {
        name: "Confirmed Kepler Exoplanet - Small Rocky World",
        data: {
            koi_score: 0.95, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0,
            koi_period: 0.893, koi_prad: 1.47, koi_teq: 973, koi_depth: 738, koi_duration: 1.19, koi_impact: 0.3
        }
    },
    TESS: {
        name: "Confirmed TESS Exoplanet - Hot Jupiter",
        data: {
            pl_orbper: 3.579, pl_rade: 10.93, pl_eqt: 1189, st_rad: 1.039, st_teff: 5731,
            st_logg: 4.4, pl_trandep: 11445, pl_trandurh: 2.90, st_tmag: 9.8
        }
    },
    K2: {
        name: "Confirmed K2 Exoplanet - Super Earth",
        data: {
            pl_orbper: 15.2, pl_rade: 2.34, pl_eqt: 320, st_rad: 0.78, st_teff: 4500,
            st_logg: 4.5, pl_trandep: 280, pl_trandur: 3.1
        }
    },
    Other: {
        name: "Generic Exoplanet Candidate",
        data: {
            period: 45.6, planet_radius: 0.95, planet_temp: 245,
            stellar_radius: 0.61, stellar_temp: 3900, stellar_logg: 4.6
        }
    }
};