
from app.core.config import settings
from supabase import Client, create_client

url = settings.SUPABASE_URL
key = settings.SUPABASE_KEY
supabase: Client = create_client(url, key)
