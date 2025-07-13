from app.api.chat import chat_bp
from app.config.environment import Config
from flask import Flask
from flask_cors import CORS

url = Config.BLOCKGPT_URL_PREFIX

app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bp, url_prefix=f"{url}")

if __name__ == "__main__":
    app.run(debug=True, host=url, port=Config.PORT)
