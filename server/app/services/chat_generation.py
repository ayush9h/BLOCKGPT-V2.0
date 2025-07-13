from app.schemas.abstract_class import APIStrategy
from app.schemas.chats import UserChatSchema
from app.services.vectorstore import retrieve_context
from app.utils.logger import logger
from app.utils.models import LLMModel
from pydantic import ValidationError


class ChatModule(APIStrategy):

    def validate_payload(self, payload:UserChatSchema):
        try:
            payload = UserChatSchema(**payload)
            return payload
        except ValidationError as e:
            return self.make_resp(
                response=e,
                execution_status="failed",
                status_code=400,
                message=f"Data validation failed due to {e}",
            )

    def execute(self, payload: UserChatSchema):
        validated_payload = self.validate_payload(payload)
        logger.info("Paylod Validated")

        MODEL_MAP = {
            "llama3-8b-8192": LLMModel.llama_model(),
            "qwen/qwen3-32b": LLMModel.qwen_model(),
            "gemma2-9b-it": LLMModel.gemma_model(),
        }

        llm = MODEL_MAP[validated_payload.model]
        logger.info("LLM Model inferenced")

        retrieved_data = retrieve_context(validated_payload.question)
        logger.info("Context Retrieved for the question")

        messages = [
            (
                "system",
                "You are helpful assistant which tell answers to questions about cryptocurrency from the context which has been retrieved only. No answers from outside of this context.",
            ),
            (
                "developer", 
                f"{validated_payload.question}\n\nContext:\n{retrieved_data['context']}"
            ),
        ]

        ai_msg = llm.invoke(messages)
        logger.info("LLM invoked for the response")

        response = ai_msg.content
        logger.info("Response generated for the question")

        return self.make_resp(
            response=response,
            execution_status="success",
            status_code=200,
            message="The response was generated successfully.",
        )
