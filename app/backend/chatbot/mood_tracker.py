from .generate_goals import PromptLoader

from typing import Dict
import os
from openai import OpenAI
import time
from loguru import logger
from dotenv import load_dotenv
import re
import json
from pathlib import Path
from groq import Groq


load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

class MoodTracker:
    def __init__(self, model_name: str, provider_name: str):

        # Define the base path (can be absolute or relative)
        base_dir = Path(__file__).parent
        self.yaml_path = base_dir / "mood_tracker_prompt.yaml"
        self.model_name = model_name
        self.provider_name = provider_name

    def call_llm(self, prompt: str, system_msg: str, get_json: bool= True):
        logger.debug(f"Groq API key: {groq_api_key}")
        # if self.provider_name == "open_ai":
        #     url = "https://api.openai.com/v1"
        #     key = os.getenv("OPENAI_API_KEY", "")
        # elif self.provider_name == "open_router":
        #     url = "https://openrouter.ai/api/v1"
        #     key = os.getenv("OPENROUTER_API_KEY", "")

        # elif self.provider_name == "groq":
        #     url = "https://api.groq.com/openai/v1"
        #     key = groq_api_key

        # elif self.provider_name == "fireworks":
        #     url = "https://api.fireworks.ai/inference/v1"
        #     key = ""

        # elif self.provider_name == "deepinfra":
        #     url = "https://api.deepinfra.com/v1/openai"
        #     key = ""
        # logger.debug(f"Provider: {self.provider_name}")
        # logger.debug(f"API key: {groq_api_key}")
        client = Groq(
            api_key=groq_api_key,
        )
        # client = Groq(api_key=key)
        logger.debug(f"Model being used: {self.model_name}")
        start = time.time()
        completion = client.chat.completions.create(
            extra_headers={},
            model=self.model_name,
            response_format={"type": "text" if not get_json else "json_object"},
            temperature=0,
            messages=(
                [
                    {
                        "role": "system",
                        "content": system_msg,
                    },
                    {"role": "user", "content": prompt},
                ]
                if get_json
                else [ {
                        "role": "system",
                        "content": system_msg,
                    },
                    {"role": "user", "content": prompt}]
            ),
        )
        end = time.time()
        time_taken = end - start
        return completion.choices[0].message.content.replace("\n", ""), time_taken
    
    @staticmethod
    def replace_quotes(string: str):
        # replace single quotes before "}"
        string = re.sub(r"\'\s*}", '"}', string)
        # replace single quotes after "{"
        string = re.sub(r"{\s*\'", '{"', string)
        # replace single quotes before ":"
        string = re.sub(r"\'\s*:", '":', string)
        # replace single quotes after " :"
        string = re.sub(r":\s*\'", ':"', string)
        # replace single quotes before ","
        string = re.sub(r"\'\s*,", '",', string)
        # replace single quotes after ","
        string = re.sub(r",\s*\'", ', "', string)
        return string

    @staticmethod
    def extract_json_string(response: str):
        start = response.find("{")
        end = response.rfind("}") + 1
        json_str = response[start:end]
        # logger.debug(f"Filtered json string: {json_str}")
        # If complete JSON object is not found, try with an optional closing brace
        opening_braces = json_str.count('{')
        closing_braces = json_str.count('}')
        if opening_braces > closing_braces:
            json_str = json_str + '}'
        return json_str

    @staticmethod
    def _postprocess_response(response, **kwargs):
        """Post-processing to extract valid json schema from the response"""
        input_string = MoodTracker.replace_quotes(response)
        # logger.debug(f"Input string for json extraction -> {input_string}")
        json_string = MoodTracker.extract_json_string(input_string)
        # logger.debug(f"Extracted json string -> {json_string}")
        return json_string

    def generate(self, context: Dict):
        
        prompt = PromptLoader(self.yaml_path, context)
        # logger.debug(f"System prompt: {prompt.system_prompt}")
        # logger.debug(f"User prompt: {prompt.user_prompt}")
        try:
            raw_res, time_taken = self.call_llm(prompt.get_user_prompt(), prompt.get_system_prompt(), get_json=True)
            parsed_output = json.loads(MoodTracker._postprocess_response(raw_res))

        except Exception as e:
            logger.error(f"Issue processing user query| error message: {e}")
            parsed_output = {}

        return parsed_output