import time
from abc import ABC, abstractmethod
from typing import Any, Literal, Optional

from app.config.environment import Config
from pymongo import MongoClient


class APIStrategy(ABC):
    def on_start(self):
        self.start_time = time.time()
        return self.start_time

    def on_finish(self):
        self.end_time = time.time()
        return self.end_time

    def get_execution_time(self):
        return self.end_time - self.start_time

    def make_resp(
        self,
        response: Optional[Any],
        execution_status: Literal["success", "failed"],
        status_code: int,
        message: str,
    ):
        return {
            "service_output": response,
            "execution_status": execution_status,
            "status_code": status_code,
            "message": message,
            "execution_time": f"{self.get_execution_time()}s",
        }

    def connect_db(self):
        return MongoClient(Config.MONGO_URI)

    @abstractmethod
    def validate_payload():
        pass

    @abstractmethod
    def execute():
        pass
