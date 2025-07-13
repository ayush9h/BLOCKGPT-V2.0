import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    BLOCKGPT_URL = os.getenv("BLOCKGPT_URL")
    PORT = os.getenv("PORT")
