from chatbot.db_utils import MongoUtils
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from pymongo import MongoClient
import os

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

# Create a blueprint for forum routes
forum_bp = Blueprint('forum', __name__)

@forum_bp.route('/getForum', methods=['GET', 'POST'])
@jwt_required()
def get_forum():
    """
    Fetch forum posts, sorted by the latest.
    """
    current_user = get_jwt_identity()
    mongo_utils = MongoUtils(client, db_name="chillmate", collection_name='Forum')

    # Retrieve all forum posts, sorted by latest
    result = [
        {**doc, "_id": str(doc["_id"])}
        for doc in mongo_utils.collection.find().sort("_id", -1)
    ]

    return jsonify(result)

@forum_bp.route('/createForum', methods=['POST'])
@jwt_required()
def create_forum():
    """
    Create a new forum post.
    """
    data = request.json
    current_user = get_jwt_identity()

    topic = data.get("topic")
    text = data.get("content")

    if not topic or not text:
        return jsonify({"error": "Topic and content are required"}), 400

    # Insert new post into the forum collection
    new_post = {
        "SFStateID": current_user,
        "Topic": topic,
        "Text": text,
        "NoofLikes": 0
    }

    mongo_utils = MongoUtils(client, db_name="chillmate", collection_name='Forum')
    mongo_utils.collection.insert_one(new_post)

    return jsonify({"message": "Post successfully added"}), 201
