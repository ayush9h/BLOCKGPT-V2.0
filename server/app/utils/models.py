import os

from app.config.environment import Config
from langchain_groq import ChatGroq

config_key = Config.GROQ_API_KEY

class LLMModel:

    def __init__(self, temperature):
        self.temperature = temperature

    def llama_model(self):
        return ChatGroq(
            model="llama3-8b-8192",
            temperature=self.temperature,
            max_retries=2,
            api_key=config_key,
        )

    def qwen_model(self):
        return ChatGroq(
            model="qwen/qwen3-32b",
            temperature=self.temperature,
            max_retries=2,
            api_key=config_key,
        )

    def gemma_model(self):
        return ChatGroq(
            model="gemma2-9b-it",
            temperature=self.temperature,
            max_retries=2,
            api_key=config_key,
        )
