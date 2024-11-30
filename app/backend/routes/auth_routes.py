from flask import Blueprint, jsonify, request
from chatbot.db_utils import MongoUtils
from pymongo import MongoClient
import os

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