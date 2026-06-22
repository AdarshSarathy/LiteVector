# 🚀 LiteVector Database & AI Search Engine

LiteVector is a highly optimized, full-stack vector database and Retrieval-Augmented Generation (RAG) pipeline built from scratch to demonstrate the mathematical foundations of AI semantic search. 

Rather than relying on heavy, off-the-shelf database solutions, this project implements a custom vector search engine using hardware-accelerated matrix operations. It is designed to be lightweight, mathematically rigorous, and fully asynchronous.

## 📂 Repository Architecture

This is a monorepo containing the complete full-stack architecture:
* `👉 /backend`: The custom asynchronous vector database, data ingestion pipeline, and FastAPI routing engine.
* `👉 /frontend`: The responsive React UI featuring a custom real-time text streaming engine.

## 🌐 Live Demos

The architecture is fully deployed and accessible via the public web. You can interact with the complete user interface or query the raw backend API directly.

* 🖥️ **[Frontend UI Demo](https://lite-vector-ai-search-engine-hsqfgz6xm-adarsh-sarathy.vercel.app):** Interact with the live React application, featuring real-time data streaming and a responsive chat interface.
* ⚙️ **[Backend API Swagger UI](https://litevector-database-production.up.railway.app/):** Directly query the vector database endpoints and test the search algorithms using the automatically generated OpenAPI documentation.

> **Infrastructure Note:** The backend is hosted on a free-tier Railway container. To conserve resources, the instance spins down after 15 minutes of inactivity. The very first search you run may take 10–15 seconds as the container wakes up and loads the AI model into RAM. All subsequent searches execute in sub-millisecond time.

## 🧠 Core Architecture & Optimizations

- **Vectorized Search Engine:** Utilizes NumPy to execute high-speed matrix multiplications across pre-allocated `float32` arrays, ensuring O(1) insertion time and sub-millisecond query latency.
- **Algorithmic Optimization:** Embeddings are L2-Normalized at the model layer. By locking vector magnitudes to exactly 1, the Cosine Similarity formula collapses into a pure Dot Product, cutting computational load in half by removing the need for magnitude division during search phases.
- **Automated Ingestion Pipeline:** Architected an automated pipeline using `FastAPI` and `pdfplumber` to extract and process PDF documents into high-dimensional vector embeddings via `sentence-transformers`.
- **Dynamic Semantic Filtering:** Implements a custom "Delta Drop-off" algorithm at the API layer. Instead of returning a static top-k list of results, the system analyzes the relative statistical gap between consecutive similarity scores and automatically truncates the long tail of irrelevant matches.
- **Streaming Telemetry:** Achieves ~280-450ms end-to-end vector retrieval latency during live benchmarking.

## 🛠️ Tech Stack

- **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy, Pydantic
- **Frontend:** React.js, Tailwind CSS, Vite
- **Machine Learning & Math:** PyTorch, sentence-transformers, NumPy
- **Infrastructure:** Docker, Docker Compose

## 📦 Local Deployment (Docker)

The backend application is fully containerized with multi-stage layer caching optimized for rapid local builds.

**1. Clone the Repository:**
```bash
git clone https://github.com/AdarshSarathy/LiteVector.git
cd LiteVector/backend
```

**2. Boot the Backend Container:**
```bash
docker compose up --build
```

**3. Run the Frontend UI:**
```bash
cd ../frontend
npm install
npm run dev
```
