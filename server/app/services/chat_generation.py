
from app.schemas.abstract_class import ApiStrategy
from app.schemas.chats import UserChatSchema
from app.services.vectorstore import retrieve_context
from app.utils.logger import logger
from app.utils.models import LLMModel
from pydantic import ValidationError


class ChatModule(ApiStrategy):

    def validate_payload(self, payload:UserChatSchema):
        try:
            payload = UserChatSchema(**payload)
            return payload
        except ValidationError as e:
            return self.make_resp(
                execution_status="failure",
                status_code=400,
                body=f"Data validation failed due to {e}"
            )


    def execute(self, payload: UserChatSchema):
        validated_payload = self.validate_payload(payload)
        logger.info("Paylod Validated")

        llm = LLMModel.llama_model()
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
            body=response,
            execution_status="success",
            status_code=200,
            message="Chat generation completed."
        )
