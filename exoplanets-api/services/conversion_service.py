import logging

logger = logging.getLogger(__name__)

def convert_nasa_to_koi_format(nasa_data: dict) -> dict:
    """Convert NASA Exoplanet Archive format to KOI format for the model"""
    mapping = {
        'koi_period': nasa_data.get('pl_orbper'),
        # Convert to ppm
        'koi_depth': nasa_data.get('pl_trandep', 0) * 10000 if nasa_data.get('pl_trandep') else 1000,
        'koi_prad': nasa_data.get('pl_rade'),
        'koi_duration': nasa_data.get('pl_trandur'),
        'koi_srad': nasa_data.get('st_rad'),
        'koi_steff': nasa_data.get('st_teff'),
        'koi_teq': nasa_data.get('pl_eqt'),
        'koi_slogg': nasa_data.get('st_logg'),
        'mission': 'Kepler'  # Default mission
    }

    # Remove None values and use defaults where needed
    cleaned_data = {}
    for key, value in mapping.items():
        if value is not None:
            cleaned_data[key] = value
        else:
            # Set defaults for missing required fields
            if key == 'koi_depth':
                cleaned_data[key] = 1000
            elif key == 'koi_duration':
                cleaned_data[key] = 5.0
            elif key == 'mission':
                cleaned_data[key] = 'Kepler'
            else:
                cleaned_data[key] = 0.0

    logger.info(f"🔄 Converted NASA data to KOI format: {cleaned_data}")
    return cleaned_data
