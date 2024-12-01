import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.backend.routes.auth_routes import auth_bp  # Import the auth blueprint
from app.backend.routes.chatbot_routes import chatbot_bp  # Import the chatbot blueprint
from app.backend.routes.forum_routes import forum_bp  # Import the forum blueprint
from app.backend.routes.journal_routes import journal_bp  # Import the journal blueprint


def create_app():
    app = Flask(__name__)

    # Load configurations
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
    load_dotenv()

    # Set Temporary Secret Key
    app.secret_key = os.urandom(24)

    # Enable CORS
    frontend_origin = os.getenv("FRONTEND_ORIGIN")
    CORS(app, origins=[frontend_origin], supports_credentials=True)

    # JWT Setup
    JWTManager(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(chatbot_bp, url_prefix='/chatbot')
    app.register_blueprint(forum_bp, url_prefix='/forum')
    app.register_blueprint(journal_bp, url_prefix='/journal')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
