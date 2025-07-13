import os

from app.config.environment import Config
from langchain_groq import ChatGroq

config_key = Config.GROQ_API_KEY

class LLMModel:

    def llama_model():
        return ChatGroq(
            model="llama3-8b-8192",
            temperature=0.3,
            max_retries=2,
            api_key=config_key,
        )

    def qwen_model():
        return ChatGroq(
            model="qwen/qwen3-32b",
            temperature=0.3,
            max_retries=2,
            api_key=config_key,
        )

    def gemma_model():
        return ChatGroq(
            model="gemma2-9b-it",
            temperature=0.3,
            max_retries=2,
            api_key=config_key,
        )
