import pytest
from unittest.mock import patch

class TestFindSimDocs:
    @patch('app.backend.routes.chatbot_routes.MongoUtils')  # Mock the MongoUtils class
    def test_successful_retrieval(self, mock_mongo_utils, client):
        """
        Test successful retrieval of similar documents.
        """
        # Mock the methods in MongoUtils
        mock_mongo_utils.return_value.generate_embeddings.return_value = [0.1, 0.2, 0.3]
        mock_mongo_utils.return_value.find_similar_documents.return_value = [
            {
                "RecourseTitle": "Stress Management Tips",
                "RecourseLink": "https://example.com/stress-tips",
                "ResourseBody": "Learn how to manage stress effectively."
            },
            {
                "RecourseTitle": "Mindfulness Techniques",
                "RecourseLink": "https://example.com/mindfulness",
                "ResourseBody": "Practice mindfulness to reduce stress."
            }
        ]

        # Input payload
        payload = {"input_text": "How to manage stress?"}

        # Send POST request to the endpoint
        response = client.post('/chatbot/find_sim_docs', json=payload)

        # Assertions
        assert response.status_code == 200
        response_data = response.get_json()
        assert len(response_data) == 2
        assert response_data[0]["Resource_title"] == "Stress Management Tips"
        assert response_data[0]["Resource_link"] == "https://example.com/stress-tips"
        assert response_data[0]["Resource_body"] == "Learn how to manage stress effectively."

    def test_missing_input_text(self, client):
        """
        Test response when input_text is missing in the payload.
        """
        # Input payload without input_text
        payload = {}

        # Send POST request to the endpoint
        response = client.post('/chatbot/find_sim_docs', json=payload)

        # Assertions
        assert response.status_code == 400
        response_data = response.get_json()
        assert response_data["error"] == "Input text is required"

    @patch('app.backend.routes.chatbot_routes.MongoUtils')  # Mock the MongoUtils class
    def test_no_similar_documents(self, mock_mongo_utils, client):
        """
        Test response when no similar documents are found.
        """
        # Mock the methods in MongoUtils to return no documents
        mock_mongo_utils.return_value.generate_embeddings.return_value = [0.1, 0.2, 0.3]
        mock_mongo_utils.return_value.find_similar_documents.return_value = []

        # Input payload
        payload = {"input_text": "How to manage stress?"}

        # Send POST request to the endpoint
        response = client.post('/chatbot/find_sim_docs', json=payload)

        # Assertions
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data == []  # Expecting an empty list

