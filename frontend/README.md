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

## 🚀 Local Development Guide

Follow these steps to run the frontend application locally on your machine.

**1. Clone the Repository:**
Clone the complete monorepo to your local machine and navigate directly into the frontend directory.
```bash
git clone https://github.com/AdarshSarathy/LiteVector.git
cd LiteVector/frontend
```

**2. Install Dependencies:**
Ensure you have Node.js installed, then install the required project packages.
```bash
npm install
```

**3. Configure Environment Variables:**
Create a `.env` file in the root of the `/frontend` directory. You will need to point this to where your backend API is running. If you are running the backend locally on its default port, use the following:
```env
VITE_API_URL=http://localhost:8000
```

**4. Start the Development Server:**
Launch the Vite development server.
```bash
npm run dev
```
The application will now be accessible in your browser, typically at `http://localhost:5173`.

## 📦 Production Build

To compile the application for production deployment:
```bash
npm run build
```
This will generate a highly optimized `dist` folder ready to be served by any static hosting provider (e.g., Vercel, Netlify, or Nginx).
