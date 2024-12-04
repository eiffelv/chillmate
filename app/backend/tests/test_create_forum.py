import pytest
from unittest.mock import patch, MagicMock

class TestCreateForum:
    @patch('app.backend.routes.forum_routes.get_jwt_identity')  # Mock get_jwt_identity
    @patch('flask_jwt_extended.view_decorators.verify_jwt_in_request')  # Mock jwt_required
    @patch('app.backend.routes.forum_routes.MongoUtils')  # Mock MongoUtils
    def test_successful_forum_creation(self, mock_mongo_utils, mock_verify_jwt, mock_get_jwt_identity, client):
        """
        Test successful creation of a forum post.
        """
        # Mock the authenticated user
        mock_get_jwt_identity.return_value = "test_user_id"

        # Mock the MongoUtils.collection.insert_one() method
        mock_insert = MagicMock()
        mock_mongo_utils.return_value.collection.insert_one = mock_insert

        # Input payload
        payload = {
            "topic": "Mental Health",
            "content": "How do I manage stress during exams?"
        }

        # Send POST request to the endpoint
        response = client.post('/forum/createForum', json=payload)

        # Assertions
        assert response.status_code == 201
        response_data = response.get_json()
        assert response_data["message"] == "Post successfully added"

        # Ensure insert_one was called with the correct data
        mock_insert.assert_called_once_with({
            "SFStateID": "test_user_id",
            "Topic": "Mental Health",
            "Text": "How do I manage stress during exams?",
            "NoofLikes": 0
        })

    @patch('app.backend.routes.forum_routes.get_jwt_identity')  # Mock get_jwt_identity
    @patch('flask_jwt_extended.view_decorators.verify_jwt_in_request')  # Mock jwt_required
    @patch('app.backend.routes.forum_routes.MongoUtils')  # Mock MongoUtils
    def test_missing_fields(self, mock_mongo_utils, mock_verify_jwt, mock_get_jwt_identity, client):
        """
        Test response when topic or content is missing in the payload.
        """
        # Mock the authenticated user
        mock_get_jwt_identity.return_value = "test_user_id"

        # Input payload missing "topic"
        payload = {
            "content": "How do I manage stress during exams?"
        }

        # Send POST request to the endpoint
        response = client.post('/forum/createForum', json=payload)

        # Assertions
        assert response.status_code == 400
        response_data = response.get_json()
        assert response_data["error"] == "Topic and content are required"

        # Input payload missing "content"
        payload = {
            "topic": "Mental Health"
        }

        # Send POST request to the endpoint
        response = client.post('/forum/createForum', json=payload)

        # Assertions
        assert response.status_code == 400
        response_data = response.get_json()
        assert response_data["error"] == "Topic and content are required"

    @patch('app.backend.routes.forum_routes.get_jwt_identity')  # Mock get_jwt_identity
    @patch('flask_jwt_extended.view_decorators.verify_jwt_in_request')  # Mock jwt_required
    @patch('app.backend.routes.forum_routes.MongoUtils')  # Mock MongoUtils
    def test_database_insertion_error(self, mock_mongo_utils, mock_verify_jwt, mock_get_jwt_identity, client):
        """
        Test response when there is a database insertion error.
        """
        # Mock the authenticated user
        mock_get_jwt_identity.return_value = "test_user_id"

        # Simulate an exception in the insert_one() method
        mock_mongo_utils.return_value.collection.insert_one.side_effect = Exception("Database error")

        # Input payload
        payload = {
            "topic": "Mental Health",
            "content": "How do I manage stress during exams?"
        }

        # Send POST request to the endpoint
        response = client.post('/forum/createForum', json=payload)

        # Assertions
        assert response.status_code == 500
        response_data = response.get_json()
        assert "error" in response_data
        assert response_data["error"] == "Database error"
