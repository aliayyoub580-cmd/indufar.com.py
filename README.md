# Indufar White Page Redirect

A minimalist React + Node.js / Express.js application that displays a clean white page for 0.1 seconds (100 ms) and then automatically redirects the user to [https://indufar.com.py](https://indufar.com.py).

## Features

- **React Frontend**: Renders a clean, blank white viewport with a 0.1-second timer redirecting to `https://indufar.com.py`.
- **Node.js & Express Backend**: Serves the application with cache-control headers, health check endpoint, and graceful shutdown.
- **Fast Build**: Built with Vite and React 19.
- **Noscript Fallback**: Includes `<meta http-equiv="refresh">` fallback for browsers or crawlers with JavaScript disabled.
- **Docker Ready**: Includes a multi-stage `Dockerfile` for streamlined containerized deployment.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the React Frontend
```bash
npm run build
```

### 3. Run the Express Server
```bash
npm start
```
The server will start at [http://localhost:3000](http://localhost:3000).

---

### Development Mode (Vite Dev Server)
To run in hot-reloading development mode:
```bash
npm run dev
```
Accessible at [http://localhost:5173](http://localhost:5173).

---

### Endpoints
- `/`: Serves the React single white redirect page.
- `/health`: Health check endpoint returning `{ status: "ok", uptime: ... }`.

---

### Docker Deployment
Build and run the Docker image:
```bash
docker build -t indufar-redirect .
docker run -p 3000:3000 indufar-redirect
```
