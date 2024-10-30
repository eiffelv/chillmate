from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
from pymongo import MongoClient
import os
from dotenv import load_dotenv
 

# Initializing flask app
app = Flask(__name__)
cors = CORS(app, origins='*')

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['your_database_name']
users_collection = db['users']

# Route for seeing a data
@app.route('/data')
def get_time():

    # Returning an api for showing in  reactjs
    return {
        'Name':"Will",
        }

#register api logic
@app.route('/register', methods=['POST'])
def register():
        data = request.json
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        sid = data.get("sid")

        # Insert new user
        new_user = {
            "username": username,
            "password": password,  # Ideally, hash the password before storing
            "email": email,
            "sid": sid
        }
        users_collection.insert_one(new_user)
        return jsonify({"message": "User registered successfully"}), 201


#login api logic
@app.route('/login', methods=('GET', 'POST'))
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({'username': username, 'password': password})
    if user:
            return jsonify({"message": "User registered successfully"}), 201
            # Add any additional logic, such as session management
    else:
            return jsonify({"message": "error"}), 202

    
# Running app
if __name__ == '__main__':
    app.run(debug=True)