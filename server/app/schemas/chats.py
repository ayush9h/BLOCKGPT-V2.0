from typing import Literal

from pydantic import BaseModel


class UserChatSchema(BaseModel):
    model: Literal["llama3-8b-8192", "qwen/qwen3-32b", "gemma2-9b-it"]
    question: str
