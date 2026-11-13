import { useEffect } from 'react';

const DEFAULT_TARGET_URL = 'https://www.indufar.com.py/blog/10';
const DEFAULT_DELAY_MS = 100; // 0.1 seconds

export default function App() {
  const config = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {};
  const targetUrl = config.targetUrl || DEFAULT_TARGET_URL;
  const delayMs = typeof config.delayMs === 'number' ? config.delayMs : DEFAULT_DELAY_MS;

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = targetUrl;
    }, delayMs);

    return () => clearTimeout(timer);
  }, [targetUrl, delayMs]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        margin: 0,
        padding: 0,
      }}
    />
  );
}
