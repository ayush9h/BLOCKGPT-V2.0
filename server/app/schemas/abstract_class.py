import time
from abc import ABC, abstractmethod
from typing import Any, Literal


class APIStrategy(ABC):
    def on_start(self):
        return time.time()

    def on_finish(self):
        return time.time()

    def get_execution_time(self):
        return self.on_finish() - self.on_start()

    def make_resp(
        self,
        response: Any,
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

    @abstractmethod
    def validate_payload():
        pass

    @abstractmethod
    def execute():
        pass
