from openlocationcode import openlocationcode as olc

def encode(lat: float, lng: float, code_length: int = 11) -> str:
    return olc.encode(lat, lng, code_length)

def decode(code: str):
    return olc.decode(code)
