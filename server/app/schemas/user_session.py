from typing import Literal

from pydantic import BaseModel


class UserSessionSchema(BaseModel):
    user_id: int
    session_id: int
