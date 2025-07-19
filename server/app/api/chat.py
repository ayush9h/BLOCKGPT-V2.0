from app.services.chat_generation import ChatModule
from app.services.user_session import UserSessionData
from flask import Blueprint, jsonify, request

chat_bp = Blueprint("chat_bp", __name__)


@chat_bp.post("/chat")
def default_chat():

    payload = request.get_json()
    try:
        service = ChatModule()

        response = service.execute(payload)

        return jsonify(response), 200
    except Exception as e:
        return (
            jsonify(
                service.make_resp(
                    response=e,
                    execution_status="failed",
                    status_code=500,
                    message="Internal Server Request Error",
                )
            ),
            500,
        )


@chat_bp.get("/user-session-data")
def user_session_data():

    payload = request.args.to_dict()
    try:
        service = UserSessionData()

        response = service.execute(payload)

        return jsonify(response), 200
    except Exception as e:
        return (
            jsonify(
                service.make_resp(
                    response=e,
                    execution_status="failed",
                    status_code=500,
                    message="Internal Server Request Error",
                )
            ),
            500,
        )
