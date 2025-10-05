# config.py

# UPDATED: Corrected the Kepler feature list to the 11 features the model was trained on.
KEPLER_FEATURES = [
    'koi_score', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
    'period', 'planet_radius', 'planet_temp', 'koi_depth', 'koi_duration',
    'koi_impact'
]
TESS_FEATURES = [
    'period', 'planet_radius', 'planet_temp', 'stellar_radius', 'stellar_temp',
    'stellar_logg', 'pl_trandep', 'pl_trandurh', 'st_tmag'
]
K2_FEATURES = [
    'period', 'planet_radius', 'planet_temp', 'stellar_radius', 'stellar_temp',
    'stellar_logg', 'pl_trandep', 'pl_trandur'
]
UNIVERSAL_FEATURES = [
    'period', 'planet_radius', 'planet_temp', 'stellar_radius',
    'stellar_temp', 'stellar_logg'
]

# Mapping from frontend feature names to backend names
FRONTEND_TO_BACKEND_MAP = {
    'koi_period': 'period',
    'koi_prad': 'planet_radius',
    'koi_teq': 'planet_temp',
    'pl_orbper': 'period',
    'pl_rade': 'planet_radius',
    'pl_eqt': 'planet_temp',
    'st_rad': 'stellar_radius',
    'st_teff': 'stellar_temp'
}