from app.services.chat_generation import ChatModule
from flask import Blueprint, request

chat_bp = Blueprint("chat_bp", __name__)


@chat_bp.post("/chat")
def start_chat():

    payload = request.get_json()
    service = ChatModule()

    response = service.execute(payload)

    return response
