import os

from chatbot.db_utils import MongoUtils
from chatbot.generate_goals import GenerateGoal
from flask import Blueprint, jsonify, request
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

# Initialize the conversation chain
groq_api_key = os.getenv('GROQ_API_KEY')
mongo_uri = os.getenv("MONGO_URI")
model = "llama3-8b-8192"
groq_chat = ChatGroq(groq_api_key=groq_api_key, model_name=model)

system_prompt = (
    "You are a mental health assistant chatbot for college students. "
    "Provide mental health assistance and necessary tips."
)

memory = ConversationBufferWindowMemory(k=8, memory_key="chat_history", return_messages=True)

prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content=system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        HumanMessagePromptTemplate.from_template("{human_input}"),
    ]
)

conversation = LLMChain(
    llm=groq_chat,
    prompt=prompt,
    verbose=False,
    memory=memory,
)
client = MongoClient(mongo_uri)

# Create a blueprint for chatbot routes
chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/generate_goal_tasks', methods=['POST'])
def generate_subtasks():
    """
    Generate subtasks for a given goal or problem.
    """
    input_text = request.json.get('input_text', "")
    logger.debug(input_text)

    if not input_text:
        return jsonify({}), 400

    model_name = "accounts/fireworks/models/llama-v3p1-70b-instruct"
    provider_name = "fireworks"

    ext_json = {
        'goal': '[Original goal/problem]',
        'subtasks': [
            {
                'subtask': '[Description of subtask 1]',
                'importance': '[Explanation of why this subtask is necessary]',
                'focus': '[What the student should concentrate on for this subtask]'
            },
        ]
    }

    context = {"user_query": input_text, "ext_json": ext_json}

    parsed_output = GenerateGoal(model_name=model_name, provider_name=provider_name).generate(context)
    if not parsed_output:
        logger.error("Empty response")
        return jsonify({"error": "Failed to generate subtasks"}), 500

    logger.debug(parsed_output)
    return jsonify(parsed_output), 200


@chatbot_bp.route('/generic_chat', methods=['POST'])
def chat():
    """
    Chat endpoint to handle user input and return chatbot responses.
    """
    data = request.get_json()
    user_question = data.get("user_question", "")
    logger.debug(user_question)

    if not user_question:
        return jsonify({"error": "Please provide a valid question."}), 400

    try:
        # Generate response using the chatbot
        response = conversation.predict(human_input=user_question)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@chatbot_bp.route('/find_sim_docs', methods=['GET', 'POST'])
def find_similar_docs():
    """
    Find similar documents based on input text embeddings.
    """
    try:
        input_text = request.json.get('input_text', "")
        if not input_text:
            return jsonify({"error": "Input text is required"}), 400

        logger.debug(input_text)

        mongo_utils = MongoUtils(client, db_name="chillmate", collection_name='Resources')
        input_text_emb = mongo_utils.generate_embeddings(input_text)
        similar_docs = mongo_utils.find_similar_documents(input_text_emb, embedding_name="ResourceEmbedding")

        formatted_docs = [
            {
                "Resource_title": doc.get("RecourseTitle", ""),
                "Resource_link": doc.get("RecourseLink", ""),
                "Resource_body": doc.get("ResourseBody", "")
            }
            for doc in similar_docs
        ]

        logger.debug(formatted_docs)
        return jsonify(formatted_docs), 200

    except Exception as e:
        logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500
