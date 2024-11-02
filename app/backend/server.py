from flask import Flask, request, jsonify, session
from flask_cors import CORS
import pymongo
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from chatbot.db_utils import MongoUtils

# Initializing flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)  # Replace with a fixed key in production

# Dynamic CORS configuration
frontend_origin = os.getenv("FRONTEND_ORIGIN")
cors = CORS(app, origins=[frontend_origin], supports_credentials=True)

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

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
        session['user_id'] = str(user['_id'])  # Storing user's unique ID in session
        session['username'] = user['Username']  # Optional: storing username
        return jsonify({"message": "User logged in successfully"}), 201
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
    session.clear()  # Clears all session data
    return jsonify({"message": "User logged out successfully"}), 200

# Sample route that requires a logged-in user
@app.route("/chatbot/find_sim_docs", methods=['GET'])
def find_similar_docs():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    inputText = request.json.get('input_text', "")
    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name='Resources')

    input_text_emb = mongoUtils.generate_embeddings(inputText)
    similar_docs = mongoUtils.find_similar_documents(input_text_emb, embedding_name="ResourceEmbedding")

    f_docs = [{"Resource_title": doc.get("RecourseTitle", ""), "Resource_link": doc.get("RecourseLink", ""), "Resource_body": doc.get("ResourseBody", "")} for doc in similar_docs]

    return jsonify(f_docs)

# Running app
if __name__ == '__main__':
    app.run(debug=True)
