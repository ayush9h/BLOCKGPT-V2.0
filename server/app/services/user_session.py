from typing import Any, Dict

from app.schemas.abstract_class import APIStrategy
from app.schemas.user_session import UserSessionSchema
from app.utils.logger import logger


class UserSessionData(APIStrategy):

    def validate_payload(self, payload: Dict[str, Any]):
        try:
            payload = UserSessionSchema(**payload)
            return payload
        except ValueError as e:
            return self.make_resp(
                response=str(e),
                execution_status="failed",
                status_code=400,
                message=f"Data validation failed due to {e}",
            )

    def fetch_user_session_data(self):
        db = self.client["blockgpt"]
        collection = db["session_data"]

        session_data = collection.find_one(
            {
                "user_id": 123,
                "session_id": 423,
            },
            {
                "_id": 0,
            },
        )
        logger.info("Documents found in the document successfully.")
        return session_data

    def execute(self, payload: Dict[str, Any]):

        self.on_start()
        self.client = self.connect_db()

        self.payload = self.validate_payload(payload)
        if (
            isinstance(self.payload, dict)
            and self.payload.get("execution_status") == "failed"
        ):
            return self.payload
        logger.info("Payload Validated")

        session_data = self.fetch_user_session_data()

        self.on_finish()

        return self.make_resp(
            response=session_data,
            execution_status="success",
            status_code=200,
            message="The response was generated successfully.",
        )
