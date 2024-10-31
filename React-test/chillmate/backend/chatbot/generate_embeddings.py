import numpy as np
import os
import google.generativeai as genai
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel
from typing import List


# def trim_input(text: str, max_len: int) -> str:

#     return " ".join(text.split()[:max_len])

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyB8pQi-f5WCy3Ek7-a2DUNkmfc3AIotfMo")

class GoogleEmbeddings:

    def __init__(self, model_name: str = "models/embedding-001") -> None:

        self.model_name = model_name

    def generate_embeddings(self, inp: str) -> np.ndarray:

        if not GOOGLE_API_KEY:
            print("Please set correct Google API key")
            return []

        genai.configure(api_key=GOOGLE_API_KEY)

        result = genai.embed_content(
            model=self.model_name, content=inp, task_type="SEMANTIC_SIMILARITY"
        )

        embds = np.array(result["embedding"])

        return list(embds.reshape(1, -1)[0])


class BERTEmbeddings:

    def __init__(self) -> None:
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
        self.model = AutoModel.from_pretrained("bert-base-uncased")

    def generate_embeddings(self, inp: str):

        inputs = self.tokenizer(inp, return_tensors="pt")

        with torch.no_grad():
            outputs = self.model(**inputs)

        embeddings = outputs.last_hidden_state

        embeddings = embeddings.mean(dim=1)

        return embeddings.tolist()[0]


class Embeddings:

    def __init__(self) -> None:
        pass

    def generate_embeddings(self, text: str, use: str = "bert") -> List:
        """
        use: "bert" or "google_gemini"
        """

        if use == "bert":
            embedding_model = BERTEmbeddings()
            return embedding_model.generate_embeddings(text)

        embedding_model = GoogleEmbeddings()
        return embedding_model.generate_embeddings(text)
    

