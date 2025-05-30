# backend/app/utils.py
from openlocationcode import openlocationcode as olc

def coordinates_to_plus_code(lat: float, lng: float) -> str:
    return olc.encode(lat, lng)