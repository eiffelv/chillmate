from generate_embeddings import Embeddings
from pymongo import MongoClient
import pymongo
from typing import List, Dict
from loguru import logger
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


class MongoUtils:
    def __init__(self, mongoclient: MongoClient, db_name, collection_name: str):
        self.client = mongoclient
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def generate_embeddings(self, text: str) -> list:
        """
        Dummy embedding generation method. Replace this with your actual class method that generates embeddings.
        """
        # Call your actual class method here that generates embeddings.
        # For demonstration, let's assume it returns a list of floats as embeddings.
        return Embeddings().generate_embeddings(text=text, use='google')

    def update_embeddings(self):
        # Find all documents in the collection
        documents = self.collection.find({})

        # Iterate over each document
        for doc in documents:
            # Get the description and title from the document
            description = doc.get('ResourseBody', '')

            # Generate embeddings for the combined text (title + description)
            text_embeddings = self.generate_embeddings(description)

            # Update the document with the new embeddings under the "text_embeddings" key
            self.collection.update_one(
                {'_id': doc['_id']},  # Use the document's unique ID to identify it
                {'$set': {'ResourceEmbedding': text_embeddings}}
            )
            logger.debug(f"Updated document {doc['_id']} with embeddings.")

    def check_similarity(self, emb1: np.ndarray, emb2: np.ndarray) -> float:

        emb1 = np.array(emb1).reshape(1,-1)
        emb2 = np.array(emb2).reshape(1,-1)
        return cosine_similarity(emb1, emb2)[0][0]

    def fetch_all_documents_with_embedding(self, embedding_name: str):
        # Fetch all documents that contain ResourceEmbedding
        return self.collection.find({embedding_name: {"$exists": True}})

    def find_similar_documents(self, inp_document_embedding: List, embedding_name: str, no_of_docs: int = 5, threshold: float = 0.6) -> List:

        # Fetch all documents with embeddings
        documents = self.fetch_all_documents_with_embedding(embedding_name=embedding_name)

        # Store documents with their similarity scores
        doc_scores = []
        
        for doc in documents:
            stored_embedding = doc.get(embedding_name, [])
            
            if len(stored_embedding) == len(inp_document_embedding):
                # Compute cosine similarity
                similarity = self.check_similarity(stored_embedding, inp_document_embedding)
                doc_scores.append((doc, similarity))

        # Sort documents based on similarity score (highest first)
        doc_scores.sort(key=lambda x: x[1], reverse=True)

        # Return the top N documents
        return [doc for doc, score in doc_scores[:no_of_docs] if score >= threshold]
