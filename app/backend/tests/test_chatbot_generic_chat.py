import pytest
from unittest.mock import patch


class TestGenericChat:
    @patch('app.backend.routes.chatbot_routes.conversation')  # Mock the conversation object
    def test_successful_chat_response(self, mock_conversation, client):
        """
        Test successful response from /chatbot/generic_chat.
        """
        # Mock the conversation.predict method
        mock_conversation.predict.return_value = "This is a response from the chatbot."

        # Input payload
        payload = {"user_question": "What is mental health?"}

        # Send POST request to the endpoint
        response = client.post('/chatbot/generic_chat', json=payload)

        # Assertions
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data["response"] == "This is a response from the chatbot."

    def test_missing_input(self, client):
        """
        Test response when user_question is missing in the payload.
        """
        # Input payload without user_question
        payload = {}

        # Send POST request to the endpoint
        response = client.post('/chatbot/generic_chat', json=payload)

        # Assertions
        assert response.status_code == 400
        response_data = response.get_json()
        assert response_data["error"] == "Please provide a valid question."

    @patch('app.backend.routes.chatbot_routes.conversation')  # Mock the conversation object
    def test_chat_generation_error(self, mock_conversation, client):
        """
        Test response when an exception occurs during chat generation.
        """
        # Simulate an exception in the conversation.predict method
        mock_conversation.predict.side_effect = Exception("Chatbot error")

        # Input payload
        payload = {"user_question": "What is mental health?"}

        # Send POST request to the endpoint
        response = client.post('/chatbot/generic_chat', json=payload)

        # Assertions
        assert response.status_code == 500
        response_data = response.get_json()
        assert response_data["error"] == "Chatbot error"
