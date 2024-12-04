import pytest
from unittest.mock import patch, MagicMock

class TestGetForum:
    @patch('app.backend.routes.forum_routes.get_jwt_identity')  # Mock get_jwt_identity
    @patch('flask_jwt_extended.view_decorators.verify_jwt_in_request')  # Mock jwt_required
    @patch('app.backend.routes.forum_routes.MongoUtils')  # Mock MongoUtils
    def test_successful_forum_retrieval(self, mock_mongo_utils, mock_verify_jwt, mock_get_jwt_identity, client):
        """
        Test successful retrieval of forum posts.
        """
        # Mock the authenticated user
        mock_get_jwt_identity.return_value = "test_user_id"

        # Mock MongoUtils.collection.find() and sort() to return sample documents
        mock_find = MagicMock()
        mock_find.sort = MagicMock(return_value=[
            {"_id": "1", "Topic": "Mental Health", "Text": "How to manage stress?"},
            {"_id": "2", "Topic": "Mindfulness", "Text": "Practice mindfulness to reduce anxiety."}
        ])
        mock_mongo_utils.return_value.collection.find.return_value = mock_find

        # Send GET request to the endpoint
        response = client.get('/forum/getForum')

        # Assertions
        assert response.status_code == 200
        response_data = response.get_json()
        assert len(response_data) == 2
        assert response_data[0]["Topic"] == "Mental Health"
        assert response_data[1]["Text"] == "Practice mindfulness to reduce anxiety."

    @patch('app.backend.routes.forum_routes.get_jwt_identity')  # Mock get_jwt_identity
    @patch('flask_jwt_extended.view_decorators.verify_jwt_in_request')  # Mock jwt_required
    @patch('app.backend.routes.forum_routes.MongoUtils')  # Mock MongoUtils
    def test_no_forum_posts(self, mock_mongo_utils, mock_verify_jwt, mock_get_jwt_identity, client):
        """
        Test response when there are no forum posts in the database.
        """
        # Mock the authenticated user
        mock_get_jwt_identity.return_value = "test_user_id"

        # Mock MongoUtils.collection.find() and sort() to return no documents
        mock_find = MagicMock()
        mock_find.sort = MagicMock(return_value=[])
        mock_mongo_utils.return_value.collection.find.return_value = mock_find

        # Send GET request to the endpoint
        response = client.get('/forum/getForum')

        # Debugging response
        print("Response:", response.get_json())
        print("Status Code:", response.status_code)

        # Assertions
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data == []  # Expecting an empty list

    @patch('app.backend.routes.forum_routes.get_jwt_identity')  # Mock get_jwt_identity
    @patch('flask_jwt_extended.view_decorators.verify_jwt_in_request')  # Mock jwt_required
    @patch('app.backend.routes.forum_routes.MongoUtils')  # Mock MongoUtils
    def test_forum_retrieval_error(self, mock_mongo_utils, mock_verify_jwt, mock_get_jwt_identity, client):
        """
        Test response when there is an exception during database interaction.
        """
        # Mock the authenticated user
        mock_get_jwt_identity.return_value = "test_user_id"

        # Simulate an exception in MongoUtils.collection.find()
        mock_mongo_utils.return_value.collection.find.side_effect = Exception("Database error")

        # Send GET request to the endpoint
        response = client.get('/forum/getForum')

        # Assertions
        assert response.status_code == 500
        response_data = response.get_json()
        assert "error" in response_data
        assert response_data["error"] == "Database error"
