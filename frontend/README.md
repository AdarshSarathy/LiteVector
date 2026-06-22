# 🖥️ LiteVector UI: Real-Time AI Search Interface

A highly responsive React application engineered to interface directly with the custom LiteVector asynchronous database. This frontend focuses heavily on optimized state management and non-blocking network architectures to handle high-frequency data streams.

## ✨ Core Engineering Features

- **Real-Time Data Streaming:** Implements a continuous text streaming engine capable of rendering generative AI responses and vector retrieval results with a median end-to-end latency of ~408ms.
- **Optimized State Management:** Utilizes advanced React state handling to smoothly process high-frequency data chunks, actively eliminating UI rendering lag and layout shifts during active streaming operations.
- **Non-Blocking Architecture:** Network requests are strictly isolated and asynchronous, ensuring the main browser thread remains unblocked and the UI remains perfectly responsive during heavy vector queries.
- **Responsive Design:** Styled entirely with Tailwind CSS, providing a clean, accessible, and mobile-responsive interface that scales flawlessly across devices.

## 🛠️ Technology Stack

- **Framework:** React.js, Vite
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (Custom Streaming Implementations)
- **Networking:** Fetch API / Native Streaming

## 🚀 Local Development

**1. Install dependencies:**
```bash
npm install
```

**2. Configure Environment:**
Create a `.env` file in the root of the frontend directory and point it to your local backend API.
```env
VITE_API_URL=http://localhost:8000
```

**3. Start the development server:**
```bash
npm run dev
```
