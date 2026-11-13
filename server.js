import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL || 'https://www.indufar.com.py/blog/10';
const REDIRECT_DELAY_MS = parseInt(process.env.REDIRECT_DELAY_MS || '100', 10);
const distPath = path.join(__dirname, 'dist');

// Check if build folder exists
if (!fs.existsSync(distPath)) {
  console.warn('Warning: "dist" directory not found. Please run "npm run build" first to build the React application.');
}

// Prevent unnecessary HTML transfer on favicon request
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    targetUrl: TARGET_URL,
    redirectDelayMs: REDIRECT_DELAY_MS,
    uptime: process.uptime()
  });
});

// Serve static assets from dist (except index.html to allow dynamic config injection)
app.use(express.static(distPath, { index: false }));

// Fallback to index.html with injected config and noscript tag
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');

    // Inject runtime config script
    const configScript = `<script>window.__APP_CONFIG__ = ${JSON.stringify({
      targetUrl: TARGET_URL,
      delayMs: REDIRECT_DELAY_MS
    })};</script>`;

    html = html.replace('</head>', `${configScript}\n</head>`);

    // Ensure noscript fallback matches TARGET_URL and delay
    const delaySeconds = (REDIRECT_DELAY_MS / 1000).toFixed(1);
    const noscriptTag = `<noscript><meta http-equiv="refresh" content="${delaySeconds};url=${TARGET_URL}" /></noscript>`;
    if (html.includes('<noscript>')) {
      html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscriptTag);
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } else {
    res.status(500).send('React build not found. Please run "npm run build" first.');
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Target: ${TARGET_URL} | Delay: ${REDIRECT_DELAY_MS}ms (0.1s)`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
export { app, server };
