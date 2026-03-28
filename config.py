import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "internship_db"

NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")
MODEL = "openai/gpt-oss-20b"