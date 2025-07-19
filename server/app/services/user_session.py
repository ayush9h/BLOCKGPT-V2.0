from typing import Any, Dict

from app.schemas.abstract_class import APIStrategy
from app.utils.logger import logger


class UserSessionData(APIStrategy):

    def validate_payload(self, payload):
        pass

    def execute(self, payload: Dict[str, Any]):

        self.on_start()

        self.payload = self.validate_payload(payload)
        if (
            isinstance(self.payload, dict)
            and self.payload.get("execution_status") == "failed"
        ):
            return self.payload
        logger.info("Payload Validated")

        self.client = self.connect_db()
        db = self.client["blockgpt"]
        collection = db["session_data"]

        session_doc = collection.find_one(
            {"user_id": 123, "session_id": 423},
            {"_id": 0},
        )
        logger.info("Documents found in the document successfully.")

        self.on_finish()

        return self.make_resp(
            response=session_doc,
            execution_status="success",
            status_code=200,
            message="The response was generated successfully.",
        )
