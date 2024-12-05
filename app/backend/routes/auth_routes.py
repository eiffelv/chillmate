from flask import Blueprint, jsonify, request, session
from chatbot.db_utils import MongoUtils
from pymongo import MongoClient
import os
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

# Create a blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)


# Register route
@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Handles user registration.
    """
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

    # Use MongoUtils to interact with the database
    mongo_utils = MongoUtils(client, db_name="chillmate", collection_name="user")

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

    mongo_utils.collection.insert_one(new_user)
    return jsonify({"message": "User registered successfully"}), 201


# Login API logic with session management
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name="user")

    user = mongoUtils.collection.find_one({'Username': username, 'Password': password})
    if user:
        # creaet token to check store data on whether it's logged in or not based on sfstateid
        access_token = create_access_token(identity=user['SFStateID'])
        return jsonify(access_token=access_token)
        # return jsonify({"message": "User logged in successfully"}), 201
    else:
        return jsonify({"message": "Invalid username or password"}), 401
    

# Route to check if user is logged in
@auth_bp.route('/is_logged_in', methods=['GET'])
def is_logged_in():
    if 'user_id' in session:
        return jsonify({"logged_in": True, "user_id": session['user_id'], "username": session.get('username')})
    else:
        return jsonify({"logged_in": False})


# Logout API logic
@auth_bp.route('/logout', methods=['POST'])
def logout():
    print("logging out of session")
    #session.clear()  # Clears all session data
    session.pop('user_id', None)
    return jsonify({"message": "User logged out successfully"}), 200

# ----------- profile api
@auth_bp.route('/getProfile', methods=['POST','GET'])
@jwt_required() 
def getProfile():
    current_user = get_jwt_identity() 
    mongoUtils = MongoUtils(client, db_name="chillmate", collection_name='user')  

    user = mongoUtils.collection.find_one({'SFStateID': current_user})
    # logger.debug(user)
    result = {
        "SFStateID": current_user,
        "FirstName": user['FirstName'],
        "LastName": user['LastName'],
        "Address": user['Address'],
        "Email": user['Email'],
        "PhoneNum": user['PhoneNum'],
        "Age": user['Age'],
        "Occupation": user['Occupation'],
        "Username": user['Username'],
        "EmergencyContactEmail": user['EmergencyContactEmail']
    }

    if user:
        return jsonify(result)
    else:
        return jsonify({'error': 'user not found'})

#-------------------------------