import pytest
from unittest.mock import patch
from loguru import logger


class TestGenerateGoalTasks:
    @patch('app.backend.routes.chatbot_routes.GenerateGoal')  # Mock the GenerateGoal class
    def test_successful_goal_generation(self, mock_generate_goal, client):
        """
        Test successful response from /chatbot/generate_goal_tasks.
        """
        # Mock the GenerateGoal.generate method
        mock_generate_goal.return_value.generate.return_value = {
            "goal": "Complete a project",
            "subtasks": [
                {
                    "subtask": "Research the topic",
                    "importance": "Understand the requirements",
                    "focus": "Find reliable sources"
                },
                {
                    "subtask": "Write a draft",
                    "importance": "Organize your thoughts",
                    "focus": "Outline the main points"
                }
            ]
        }

        # Input payload
        payload = {"input_text": "Complete a project"}

        # Send POST request to the endpoint
        response = client.post('/chatbot/generate_goal_tasks', json=payload)

        # Assertions
        assert response.status_code == 200
        response_data = response.get_json()
        assert response_data["goal"] == "Complete a project"
        assert len(response_data["subtasks"]) == 2
        assert response_data["subtasks"][0]["subtask"] == "Research the topic"

    def test_missing_input_text(self, client):
        """
        Test response when input_text is missing in the payload.
        """
        # Input payload without input_text
        payload = {}

        # Send POST request to the endpoint
        response = client.post('/chatbot/generate_goal_tasks', json=payload)

        # Assertions
        assert response.status_code == 400
        response_data = response.get_json()
        assert response_data == {}  # Expecting an empty dictionary

    @patch('app.backend.routes.chatbot_routes.GenerateGoal')  # Mock the GenerateGoal class
    def test_generate_goal_error(self, mock_generate_goal, client):
        """
        Test response when GenerateGoal returns an empty response or raises an error.
        """
        # Mock the GenerateGoal.generate method to return an empty response
        mock_generate_goal.return_value.generate.return_value = {}

        # Input payload
        payload = {"input_text": "Complete a project"}

        # Send POST request to the endpoint
        response = client.post('/chatbot/generate_goal_tasks', json=payload)
        # Assertions
        assert response.status_code == 500
        response_data = response.get_json()
        assert response_data["error"] == "Failed to generate subtasks"
