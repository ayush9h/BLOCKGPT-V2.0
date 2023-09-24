from os import path, environ
from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain.chains import OpenAIModerationChain,LLMChain,SimpleSequentialChain
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import TextLoader
from langchain.document_loaders.csv_loader import CSVLoader
from langchain.vectorstores import DocArrayInMemorySearch,FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from bson import ObjectId

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*",transports = ['websocket'],async_mode = "threading")

# Loading the .env files
basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env.development"))

# Loading the API Keys
API_KEY = environ.get("OPEN_AI")
MONGO_URI = environ.get("MONGO_URI")

# Loading the Crypto data
loader = TextLoader("./items.txt")
# loader = CSVLoader(file_path='./cryptodata1.csv',csv_args={
#         "delimiter": ",",
#         "quotechar": '"',
#         "fieldnames": ["id","name","symbol","description","max_supply","circulating_supply","total_supply"],
#     },)
raw_data = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 1000,
    chunk_overlap  = 20,
)

# documents = text_splitter.split_documents(raw_data)
# Applying the embeddings to the docs
embeddings = OpenAIEmbeddings(openai_api_key=API_KEY)
db = FAISS.from_documents(raw_data, embeddings)


# Defining the OpenAI Model 
text  = """ You are an assistant, your task is to help people provide latest info about crypto
        currencies using the provided dataset.  
        """
prompt = PromptTemplate(template = "{text}",input_variables=["text"])
llm_chain = LLMChain(llm=ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k", openai_api_key = API_KEY, verbose=False),prompt=prompt)
moderation_chain = OpenAIModerationChain(openai_api_key = API_KEY,moderation_rules=[{"name": "No Inappropriate Content",
                                             "categories": ["insult", "threat", "identity_hate"]}])
chain = SimpleSequentialChain(chains=[llm_chain, moderation_chain])

# Database connection
client = MongoClient(MONGO_URI)
db_instance = client['BlockGPT_database']

# Collection name format for user conversations
COLLECTION_NAME = "user_conversation_"

@app.route("/api", methods=['POST'])
def get_bot_response():
    data = request.get_json()
    message = data['message']
    email = data['email']
    name = data['name']
    session_id = data['session_id']
    picture = data['picture']

    # Get or create the collection for the user's conversation
    user_collection = db_instance[COLLECTION_NAME + email]
    user_conversation = user_collection.find_one({"_id": ObjectId(session_id)})
    if user_conversation:
        conversation = user_conversation["conversation"]
    else:
        conversation = []

    
    # Searching with semantic search
    docs = db.similarity_search(message)
    qdocs = "".join([docs[i].page_content for i in range(len(docs))])
    response = chain.run(f"{qdocs} Question: {message}")

    conversation.append({"user_message": message, "response": response})
    user_collection.update_one({"_id": ObjectId(session_id)}, {"$set": {"name": name, "picture": picture, "conversation": conversation}}, upsert=True)

    # Emit the chat history update via WebSocket to the relevant client(s)
    socketio.emit('chat_history_update', {"session_id": session_id, "conversation": conversation}, namespace='/chat')
    
    return jsonify({
        "message": response
    }), 201

@app.route("/api/chat-history/<email>/<session_id>", methods=['GET'])
def get_chat_history(email, session_id):
    user_collection = db_instance[COLLECTION_NAME + email]
    user_conversation = user_collection.find_one({"_id": ObjectId(session_id)})
    
    if user_conversation:
        conversation = user_conversation["conversation"]
    else:
        conversation = []
    
    return jsonify(conversation), 200

@app.route("/api/new-chat-session", methods=['POST'])
def create_new_chat_session():
    data = request.get_json()
    email = data['email']
    
    # Get or create the collection for the user's conversation
    user_collection = db_instance[COLLECTION_NAME + email]
    
    # Check if a new session should be created or an existing one used
    new_session = data.get('new_session', False)
    if new_session:
        # Create a new session for the user by inserting an empty document
        new_session_doc = user_collection.insert_one({"conversation": []})
        session_id = str(new_session_doc.inserted_id)
    else:
        # Use the selected session
        session_id = data.get('session_id')
    
    return jsonify({"message": "New chat session created.", "session_id": session_id}), 201


# Retrieving the chat history of each email session wise
@app.route("/api/chat-sessions/<email>", methods=['GET'])
def get_chat_sessions(email):
    user_collection = db_instance[COLLECTION_NAME + email]
    user_sessions = list(user_collection.find({}, {"_id": 1}))
    chat_sessions = [str(session["_id"]) for session in user_sessions]
    return jsonify(chat_sessions), 200

# Deleting the chat history of the email-id session wise
@app.route("/api/delete-chat-history/<email>/<session_id>", methods=['DELETE'])
def delete_chat_history(email, session_id):
    user_collection = db_instance[COLLECTION_NAME + email]
    user_conversation = user_collection.find_one({"_id": ObjectId(session_id)})
    
    if user_conversation:
        # Delete the chat history from MongoDB
        user_collection.delete_one({"_id": ObjectId(session_id)})
        return jsonify({"message": "Chat history deleted successfully."}), 200
    else:
        return jsonify({"error": "Chat session not found."}), 404

if __name__ == "__main__":
    socketio.run(app, debug=True, port=9000, host="0.0.0.0")