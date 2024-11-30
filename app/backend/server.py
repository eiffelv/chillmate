import os

import pymongo
from chatbot.db_utils import MongoUtils
from chatbot.generate_goals import GenerateGoal
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from flask_session import Session
from langchain.chains import LLMChain
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_core.messages import SystemMessage
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain_groq import ChatGroq
from loguru import logger
from pymongo import MongoClient

# Initializing flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)  # Replace with a fixed key in production
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# Session(app)

# Session configuration
# app.config['SESSION_COOKIE_HTTPONLY'] = True  # Cookie accessible only through HTTP(S), not JavaScript
# app.config['SESSION_COOKIE_SECURE'] = False  # Use this in production; for development, set to False if not using HTTPS
# app.config['SESSION_PERMANENT'] = True
# app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # Session lifetime in seconds (e.g., 1 day)

# app.config['SESSION_TYPE'] = 'filesystem'  # Store session data in the file system
# Session(app)


app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Replace with a strong secret key
jwt = JWTManager(app)



# Dynamic CORS configuration
frontend_origin = os.getenv("FRONTEND_ORIGIN")

cors = CORS(app, origins=[frontend_origin], supports_credentials=True)

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

# Setup global variables for chatbot
groq_api_key = os.getenv('GROQ_API_KEY')
model = 'llama3-8b-8192'groq_api_key = os.getenv('GROQ_API_KEY')
groq_chat = ChatGroq(
    groq_api_key=groq_api_key, 
    model_name=model
)

system_prompt = 'You are a mental health assisstant chatbot for college going students and you are tasked with helping them by providing mental health assisstance and necesary tips.'
conversational_memory_length = 8
memory = ConversationBufferWindowMemory(k=conversational_memory_length, memory_key="chat_history", return_messages=True)

# Construct a chat prompt template
prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content=system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        HumanMessagePromptTemplate.from_template("{human_input}"),
    ]
)

# Initialize the conversation chain
conversation = LLMChain(
    llm=groq_chat,
    prompt=prompt,
    verbose=False,
    memory=memory,
)

# Register API logic
@app.route('/register', methods=['GET', 'POST'])
def register():
    data = request.json
    SFStateID = data.get("sfsu_id")
    FirstName = data.get("first_name")
    LastName = data.get("last_name")
    Email = data.get("email")
    Password = data.get("password")
    Address = data.get("Address")
    PhoneNum = data.get("phone_number")
    Age = data.get("Age")
    Occupation = data.get("Occupation")
    Username = data.get("username")
    EmergencyContactEmail = data.get("EmergencyContactEmail")

    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name="user")

    # Insert new user
    new_user = {
        "SFStateID": SFStateID,
        "FirstName": FirstName,
        "LastName": LastName,
        "Email": Email,
        "Password": Password,
        "Address": Address,
        "PhoneNum": PhoneNum,
        "Age": Age,
        "Occupation": Occupation,
        "Username": Username,
        "EmergencyContactEmail": EmergencyContactEmail
    }
    mongoUtils.collection.insert_one(new_user)
    return jsonify({"message": "User registered successfully"}), 201

# Login API logic with session management
@app.route('/login', methods=['GET', 'POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name="user")

    user = mongoUtils.collection.find_one({'Username': username, 'Password': password})
    if user:
        session['user_id'] = user['SFStateID'] # Storing user's unique ID in session
        #session['username'] = user['Username']  # Optional: storing username

        #creaet token to check store data on whether it's logged in or not based on sfstateid
        access_token = create_access_token(identity=user['SFStateID'])
        return jsonify(access_token=access_token)
        # return jsonify({"message": "User logged in successfully"}), 201
    else:
        return jsonify({"message": "Invalid username or password"}), 401

# Route to check if user is logged in
@app.route('/is_logged_in', methods=['GET'])
def is_logged_in():
    if 'user_id' in session:
        return jsonify({"logged_in": True, "user_id": session['user_id'], "username": session.get('username')})
    else:
        return jsonify({"logged_in": False})

# Logout API logic
@app.route('/logout', methods=['POST'])
def logout():
    print("logging out of session")
    #session.clear()  # Clears all session data
    session.pop('user_id', None)
    return jsonify({"message": "User logged out successfully"}), 200

# Find similar docs endpoint


@app.route("/chatbot/generate_goal_tasks", methods=['GET', 'POST'])
def generate_subtasks():
    
    inputText = request.json.get('input_text', "")
    logger.debug(inputText)
    
    if not inputText:
        return jsonify({})
    
    model_name = "accounts/fireworks/models/llama-v3p1-70b-instruct"
    provider_name = "fireworks"

    ext_json = { 'goal': '[Original goal/problem]', 
                'subtasks': [{ 'subtask': '[Description of subtask 1]', 
                           'importance': '[Explanation of why this subtask is necessary]', 
                           'focus': '[What the student should concentrate on for this subtask]' }, 
                           ... ] 
                }

    context = {"user_query": inputText, "ext_json": ext_json}

    parsed_output = GenerateGoal(model_name=model_name, provider_name=provider_name).generate(context)
    if not parsed_output:
        logger.error("Empty response")

    logger.debug(parsed_output)
    return jsonify(parsed_output)


#---- Forum API ----
# get at least 5 post from the forum database
@app.route('/getForum', methods=['POST', 'GET'])
@jwt_required() 
def getForum(): 
    current_user = get_jwt_identity()
    print(current_user)

    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name='Forum')
    result = [
        {**doc, "_id": str(doc["_id"])} for doc in mongoUtils.collection.find().sort("_id", -1)
    ]
    return jsonify(result)

@app.route('/createForum', methods=['POST', 'GET'])
@jwt_required() 
def createForum(): 
    data = request.json
    current_user = get_jwt_identity()
    topic = data.get("topic")
    text = data.get("content")
    
    new_post = {
        "SFStateID": current_user,
        "Topic": topic,
        "Text": text,
        "NoofLikes": 0
    }

    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name='Forum')
    mongoUtils.collection.insert_one(new_post)
    return jsonify({"message": "Post succesfully added"}), 201


# @app.route('/searchForum', methods=['POST', 'GET'])
# def searchForum():
#     data = request.json
#     user = mongoUtils.collection.find_one({'Username': username, 'Password': password})

#---- Journal API ----
@app.route('/getJournal', methods=['POST', 'GET'])
@jwt_required() 
def getJournal(): 
    current_user = get_jwt_identity()

    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name='Journal')
    result = [
        {**doc, "_id": str(doc["_id"])} for doc in mongoUtils.collection.find({'SFStateID': current_user}).sort("_id", -1)
    ]
    logger.error(result)
    return jsonify(result)

@app.route('/createJournal', methods=['POST','GET'])
@jwt_required() 
def createJournal():
    current_user = get_jwt_identity()
    data = request.json
    title = data.get("title")
    content = data.get("content")
    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name='Journal')

    new_journal = {
        "SFStateID": current_user,
        "Title": title,
        "Content": content,
    }

    mongoUtils.collection.insert_one(new_journal)
    return jsonify({"message": "Post succesfully added"}), 201

#_____________________________

#-------------------------------

@app.route('/chatbot/generic_chat', methods=['POST'])
def chat():
    """
    Chat endpoint to handle user input and return chatbot responses.
    Expects JSON input with a "user_question" key.
    """
    data = request.get_json()
    user_question = data.get("user_question", "")

    if not user_question:
        return jsonify({"error": "Please provide a valid question."}), 400

    try:
        # Generate response using the chatbot
        response = conversation.predict(human_input=user_question)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Running app
if __name__ == '__main__':
    app.run(debug=True)
