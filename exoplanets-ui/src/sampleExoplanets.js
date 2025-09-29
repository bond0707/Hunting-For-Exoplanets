export const sampleExoplanets = [
    {
        name: 'Kepler-186f (Habitable Zone Earth-sized Planet)',
        isExoplanet: true,
        data: {
            orbital_period: 129.9, transit_depth: 430, planet_radius: 1.17, transit_duration: 5.3,
            stellar_radius: 0.52, stellar_teff: 3755, eq_temp: 188, mission: 'Kepler',
        },
    },
    {
        name: 'TRAPPIST-1e (Potentially Habitable)',
        isExoplanet: true,
        data: {
            orbital_period: 6.1, transit_depth: 7720, planet_radius: 0.92, transit_duration: 1.26,
            stellar_radius: 0.12, stellar_teff: 2566, eq_temp: 251, mission: 'TESS',
        },
    },
    {
        name: '55 Cancri e (Super-Earth Lava World)',
        isExoplanet: true,
        data: {
            orbital_period: 0.73, transit_depth: 370, planet_radius: 1.88, transit_duration: 1.8,
            stellar_radius: 0.94, stellar_teff: 5196, eq_temp: 2000, mission: 'TESS',
        },
    },
];