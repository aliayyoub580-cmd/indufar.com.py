import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { Socket } from 'node:net';
import { app, server } from './server.js';

test('Express /favicon.ico returns 204 No Content', async () => {
  await new Promise((resolve, reject) => {
    const socket = new Socket();
    const req = new http.IncomingMessage(socket);
    req.method = 'GET';
    req.url = '/favicon.ico';

    const res = new http.ServerResponse(req);
    res.end = () => {
      try {
        assert.equal(res.statusCode, 204);
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    app.handle(req, res);
  });
});

test('Express /health endpoint returns correct JSON configuration', async () => {
  await new Promise((resolve, reject) => {
    const socket = new Socket();
    const req = new http.IncomingMessage(socket);
    req.method = 'GET';
    req.url = '/health';

    const res = new http.ServerResponse(req);
    let body = '';

    res.write = (chunk) => {
      body += chunk;
      return true;
    };

    res.end = (chunk) => {
      if (chunk) body += chunk;
      try {
        assert.equal(res.statusCode, 200);
        const data = JSON.parse(body);
        assert.equal(data.status, 'ok');
        assert.equal(data.targetUrl, 'https://indufar.com.py');
        assert.equal(data.redirectDelayMs, 100);
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    app.handle(req, res);
  });
});

test('Express GET / returns HTML with injected config and white screen styles', async () => {
  await new Promise((resolve, reject) => {
    const socket = new Socket();
    const req = new http.IncomingMessage(socket);
    req.method = 'GET';
    req.url = '/';

    const res = new http.ServerResponse(req);
    let body = '';

    res.write = (chunk) => {
      body += chunk;
      return true;
    };

    res.end = (chunk) => {
      if (chunk) body += chunk;
      try {
        assert.equal(res.statusCode, 200);
        assert.ok(body.includes('window.__APP_CONFIG__'), 'Must include window.__APP_CONFIG__');
        assert.ok(body.includes('https://indufar.com.py'), 'Must include target URL');
        assert.ok(body.includes('100'), 'Must include 100ms delay');
        assert.ok(body.includes('#ffffff'), 'Must include white screen style');
        assert.ok(body.includes('<div id="root"></div>'), 'Must contain React root element');
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    app.handle(req, res);
  });
});

test.after(() => {
  if (server && server.close) {
    server.close();
  }
});
