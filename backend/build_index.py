import numpy as np
import json
from datasets import load_dataset
from vector_core import EmbeddingService

print("Downloading dataset...")
dataset = load_dataset("SetFit/ag_news", split="train") # loads the ag_news dataset

texts = dataset['text'][:4000] # selects only 4000 records

print("Initializing AI Engine...")
ai_service = EmbeddingService()

print(f"Embedding {len(texts)} documents... (This might take a couple minutes)")
vectors = ai_service.model.encode(texts, normalize_embeddings=True, show_progress_bar=True)

print("Saving binaries to disk...")
np.save("seed_vectors.npy", vectors) # saves the computed vectors

metadata = {i: text for i, text in enumerate(texts)} # creates metadata
with open("seed_metadata.json", "w") as f:
    json.dump(metadata, f) # saves metadata

print("Pre-computation complete! You now have a massive dataset ready to load instantly.")