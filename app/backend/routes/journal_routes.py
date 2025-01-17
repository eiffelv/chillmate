from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from chatbot.db_utils import MongoUtils
from loguru import logger
from pymongo import MongoClient
import os

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

# Create a blueprint for journal routes
journal_bp = Blueprint('journal', __name__)

@journal_bp.route('/getJournal', methods=['GET', 'POST'])
@jwt_required()
def get_journal():
    """
    Fetch journal entries for the current user.
    """
    current_user = get_jwt_identity()

    mongo_utils = MongoUtils(client, db_name="chillmate", collection_name='Journal')
    result = [
        {**doc, "_id": str(doc["_id"])}
        for doc in mongo_utils.collection.find({'SFStateID': current_user}).sort("Timestamp", -1)
    ]

    logger.debug(result)
    return jsonify(result)

@journal_bp.route('/createJournal', methods=['POST'])
@jwt_required()
def create_journal():
    """
    Create a new journal entry for the current user.
    """
    current_user = get_jwt_identity()
    data = request.json

    title = data.get("title")
    content = data.get("content")
    date = data.get("date")
    color = data.get("color")

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    # Insert new journal entry into the Journal collection
    new_journal = {
        "SFStateID": current_user,
        "Title": title,
        "Content": content,
        "Timestamp": date,
        "Color": color,
    }

    mongo_utils = MongoUtils(client, db_name="chillmate", collection_name='Journal')
    mongo_utils.collection.insert_one(new_journal)

    return jsonify({"message": "Post successfully added"}), 201

#function to delete journal
@journal_bp.route('/deleteJournal', methods=['POST', 'GET'])
@jwt_required()
def delete_journal():
    try:
        current_user = get_jwt_identity()
        data = request.json

        title = data.get("title")
        content = data.get("content")

        logger.debug(f"Deleting journal entry id: {current_user}, title: {title}, and content: {content}")

        mongo_utils = MongoUtils(client, db_name="chillmate", collection_name='Journal')
        mongo_utils.collection.delete_many({"SFStateID": current_user, "Title":title, "Content": content})

        return jsonify({"message": "journal successfully deleted"}), 201
    except Exception as e:
        logger.error(f"Error in /deleteJournal: {e}")
        return jsonify({"error": str(e)}), 500
