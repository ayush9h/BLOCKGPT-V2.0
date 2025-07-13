import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    BLOCKGPT_URL_PREFIX = os.getenv("BLOCKGPT_URL_PREFIX")
    PORT = os.getenv("PORT")
