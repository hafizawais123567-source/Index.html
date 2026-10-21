import http from 'node:http';
import { readFile, appendFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'public');
const PORT = process.env.PORT || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon'
};

const send = (res, code, body, type = 'text/plain; charset=utf-8') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(body);
};

async function handleContact(req, res) {
  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > 1e5) return send(res, 413, 'Too large'); }
  try {
    const { name, email, message, budget } = JSON.parse(raw);
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || (message || '').trim().length < 10)
      return send(res, 400, JSON.stringify({ ok: false, error: 'Please complete all fields.' }), TYPES['.json']);
    await appendFile(join(ROOT, '..', 'data', 'messages.jsonl'),
      JSON.stringify({ at: new Date().toISOString(), name, email, budget, message }) + '\n');
    send(res, 200, JSON.stringify({ ok: true }), TYPES['.json']);
  } catch { send(res, 400, JSON.stringify({ ok: false, error: 'Invalid request.' }), TYPES['.json']); }
}

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && pathname === '/api/contact') return handleContact(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  let rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  if (rel.endsWith('/') || rel === '.') rel = join(rel, 'index.html');
  try {
    send(res, 200, await readFile(join(ROOT, rel)), TYPES[extname(rel)] || 'application/octet-stream');
  } catch {
    try { send(res, 404, await readFile(join(ROOT, '404.html')), TYPES['.html']); }
    catch { send(res, 404, 'Not found'); }
  }
}).listen(PORT, () => console.log(`Dzone PKP running at http://localhost:${PORT}`));
