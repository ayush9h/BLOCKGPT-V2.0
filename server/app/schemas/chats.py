from pydantic import BaseModel


class UserChatSchema(BaseModel):
    question: str
