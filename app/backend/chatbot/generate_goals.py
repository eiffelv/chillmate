import yaml
from jinja2 import Template

from typing import Dict
import os
from openai import OpenAI
import time
from loguru import logger
from dotenv import load_dotenv
import re
import json

load_dotenv()

fireworks_key = os.getenv("fireworks_key")


class PromptLoader:
    def __init__(self, yaml_file_path, context=None):
        """
        Initializes the PromptLoader class.
        :param yaml_file_path: Path to the YAML file.
        :param context: Dictionary of context values to format the prompts.
        """
        self.yaml_file_path = yaml_file_path
        self.context = context if context else {}
        self.user_prompt = ""
        self.system_prompt = ""
        self.load_prompts()

    def load_prompts(self):
        try:
            with open(self.yaml_file_path, 'r') as file:
                data = yaml.safe_load(file)
                
                # Use Jinja2 Template for rendering
                user_prompt_template = Template(data.get('user_prompt', ''))
                system_prompt_template = Template(data.get('system_prompt', ''))
                
                # Render templates with the provided context
                self.user_prompt = user_prompt_template.render(**self.context)
                self.system_prompt = system_prompt_template.render(**self.context)
        except FileNotFoundError:
            print(f"Error: The file {self.yaml_file_path} was not found.")
        except yaml.YAMLError as exc:
            print(f"Error parsing YAML file: {exc}")
        except Exception as exc:
            print(f"Error rendering templates: {exc}")

    def get_user_prompt(self):
        return self.user_prompt

    def get_system_prompt(self):
        return self.system_prompt


class GenerateGoal:
    def __init__(self, model_name: str, provider_name: str, yaml_path: str = "app/backend/chatbot/goal_prompt.yaml"):
        self.yaml_path = yaml_path
        self.model_name = model_name
        self.provider_name = provider_name

    def call_llm(self, prompt: str, system_msg: str, get_json: bool= True):
        if self.provider_name == "open_ai":
            url = "https://api.openai.com/v1"
            key = os.getenv("OPENAI_API_KEY", "")
        elif self.provider_name == "open_router":
            url = "https://openrouter.ai/api/v1"
            key = os.getenv("OPENROUTER_API_KEY", "")

        elif self.provider_name == "groq":
            url = "https://api.groq.com/openai/v1"
            key = ""

        elif self.provider_name == "fireworks":
            url = "https://api.fireworks.ai/inference/v1"
            key = fireworks_key

        elif self.provider_name == "deepinfra":
            url = "https://api.deepinfra.com/v1/openai"
            key = ""

        client = OpenAI(
            base_url=url,
            api_key=key,
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
        input_string = GenerateGoal.replace_quotes(response)
        # logger.debug(f"Input string for json extraction -> {input_string}")
        json_string = GenerateGoal.extract_json_string(input_string)
        # logger.debug(f"Extracted json string -> {json_string}")
        return json_string

    def generate(self, context: Dict):
        
        prompt = PromptLoader(self.yaml_path, context)
        try:
            raw_res, time_taken = self.call_llm(prompt.get_user_prompt(), prompt.get_system_prompt(), get_json=True)
            parsed_output = json.loads(GenerateGoal._postprocess_response(raw_res))

        except Exception as e:
            logger.error(f"Issue processing user query| error message: {e}")
            parsed_output = {}

        return parsed_output
