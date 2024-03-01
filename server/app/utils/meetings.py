import requests
from elevenlabs import generate, play
from elevenlabs.client import ElevenLabs
from app.core import config

VOICE = "Rachel"
MODEL = "eleven_multilingual_v2"
client = ElevenLabs(api_key=config.settings.ELEVENLABS_API_KEY)
def text_to_speech(message: str):
    audio_bytes = generate(
        text=message,
        voice=VOICE,
        model=MODEL
    )
    return audio_bytes