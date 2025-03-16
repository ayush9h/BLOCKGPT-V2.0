import os

from app.api.chat import chat_bp
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

load_dotenv()

url = os.getenv("BLOCKGPT_URL")
app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bp, url_prefix=f"{url}")

if __name__ == "__main__":
    app.run(debug=True, port=os.getenv("PORT"))
