from typing import Any, Dict

from app.data.prompts import SYSTEM_MESSAGE
from app.schemas.abstract_class import APIStrategy
from app.schemas.chats import UserChatSchema
from app.services.preprocess import preprocess_and_store
from app.services.vectorstore import retrieve_context
from app.utils.logger import logger
from app.utils.models import LLMModel


class ChatModule(APIStrategy):

    def __init__(self):
        self.MODEL_MAP = {
            "llama3-8b-8192": LLMModel.llama_model(),
            "qwen/qwen3-32b": LLMModel.qwen_model(),
            "gemma2-9b-it": LLMModel.gemma_model(),
        }

    def validate_payload(self, payload:UserChatSchema):
        try:
            payload = UserChatSchema(**payload)
            return payload
        except ValueError as e:
            return self.make_resp(
                response=str(e),
                execution_status="failed",
                status_code=400,
                message=f"Data validation failed due to {e}",
            )

    def response_generator(self) -> str:
        llm = self.MODEL_MAP[self.payload.model]
        logger.info(f"{self.payload.model} inferencing successful")

        # preprocess_and_store()

        retrieved_data = retrieve_context(self.payload.question)
        logger.info("Context Retrieved for the question")

        messages = [
            (
                "system",
                SYSTEM_MESSAGE,
            ),
            (
                "developer",
                f"{self.payload.question}\n\nContext:\n{retrieved_data['context']}",
            ),
        ]

        ai_msg = llm.invoke(messages)
        logger.info("LLM invoked for the response")

        response = ai_msg.content
        logger.info("Response generated for the question")

        return response

    def execute(self, payload: Dict[str, Any]):

        self.on_start()

        self.payload = self.validate_payload(payload)
        if (
            isinstance(self.payload, dict)
            and self.payload.get("execution_status") == "failed"
        ):
            return self.payload
        logger.info("Payload Validated")

        response = self.response_generator()

        self.on_finish()

        return self.make_resp(
            response=response,
            execution_status="success",
            status_code=200,
            message="The response was generated successfully.",
        )
