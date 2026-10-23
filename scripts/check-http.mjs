import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { request as httpRequest } from 'node:http';
import { createServer, preview } from 'vite';
import { responseSecurityHeaders } from '../config/security.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const token = 'synthetic-security-check-' + randomUUID();
const envFile = path.join(root, '.env.security-check-' + randomUUID());
const outsideFile = path.resolve(root, '..', '.http-security-check-' + randomUUID() + '.txt');
let dev;
let production;
let envCreated = false;
let outsideCreated = false;
const checks = [];
const request = (base, resource, options = {}) => fetch(base + resource, { ...options, signal: AbortSignal.timeout(10000) });
function checkHeaders(response) {
  for (const [header, value] of Object.entries(responseSecurityHeaders)) assert.equal(response.headers.get(header), value);
}
function listeningUrl(server) {
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  return 'http://127.0.0.1:' + address.port;
}
try {
  await writeFile(envFile, 'SYNTHETIC_AUDIT_VALUE=' + token, { flag: 'wx' }); envCreated = true;
  await writeFile(outsideFile, token, { flag: 'wx' }); outsideCreated = true;
  // This check exercises HTTP boundaries; React behaviour is covered separately.
  dev = await createServer({ root, server: { port: 0, preTransformRequests: false }, optimizeDeps: { noDiscovery: true, include: [] }, logLevel: 'silent' });
  await dev.listen();
  const devUrl = listeningUrl(dev.httpServer);
  const home = await request(devUrl, '/');
  assert.equal(home.status, 200); checkHeaders(home);
  await home.text();
  checks.push('Development page and response headers: passed');
  const module = await request(devUrl, '/src/app/App.tsx', { headers: { Origin: 'https://untrusted.example' } });
  assert.equal(module.status, 200);
  assert.equal(module.headers.get('access-control-allow-origin'), null);
  await module.text();
  checks.push('Cross-origin access does not receive CORS permission: passed');
  // Use node:http: fetch may normalize the Host header back to its URL host.
  const badHostStatus = await new Promise((resolve, reject) => {
    const req = httpRequest(devUrl, { headers: { Host: 'untrusted.example' }, timeout: 10000 }, response => { response.resume(); resolve(response.statusCode); });
    req.on('error', reject); req.on('timeout', () => req.destroy(new Error('Host check timed out'))); req.end();
  });
  assert.equal(badHostStatus, 403);
  checks.push('Untrusted Host header rejected: passed');
  const envName = path.basename(envFile);
  for (const resource of [
    '/' + envName + '?raw',
    '/' + envName + '?import&raw',
    '/' + envName + '::$DATA?raw',
    '/@fs/' + envFile.replaceAll('\\', '/') + '?raw',
    '/@fs/' + outsideFile.replaceAll('\\', '/') + '?raw',
    '/.git/config?raw',
    '/reference/photos/historical-park.jpg',
  ]) {
    const response = await request(devUrl, resource);
    const text = await response.text();
    assert.ok([403, 404].includes(response.status), resource + ' was not blocked (' + response.status + ')');
    assert.ok(!text.includes(token));
  }
  checks.push('Environment files, Windows alternate paths, Git metadata, originals and outside-root files blocked: passed');

  production = await preview({ root, preview: { port: 0 }, logLevel: 'silent' });
  const productionUrl = listeningUrl(production.httpServer);
  const response = await request(productionUrl, '/');
  assert.equal(response.status, 200); checkHeaders(response);
  const html = await response.text();
  assert.match(html, /Content-Security-Policy/);
  assert.match(html.replaceAll('&#39;', "'"), /script-src 'self'/);
  assert.doesNotMatch(html, /<script\b(?![^>]*\bsrc=)[^>]*>/);
  const script = html.match(/<script\b[^>]*\bsrc="([^"]+)"/);
  assert.ok(script);
  const js = await request(productionUrl, script[1]);
  assert.equal(js.status, 200); assert.match(js.headers.get('content-type'), /javascript/);
  await js.arrayBuffer();
  const stylesheet = html.match(/<link\b[^>]*\bhref="([^"]+\.css)"/);
  assert.ok(stylesheet);
  const css = await request(productionUrl, stylesheet[1]);
  assert.equal(css.status, 200); assert.match(css.headers.get('content-type'), /text\/css/);
  await css.text();
  checks.push('Production HTML, CSP and bundled JavaScript: passed');
  for (const name of ['historical-park', 'wat-phra-borommathat', 'khlong-lan', 'national-museum', 'mae-wong']) {
    const image = await request(productionUrl, '/images/' + name + '.webp');
    assert.equal(image.status, 200); assert.match(image.headers.get('content-type'), /image\/webp/);
    const local = await readFile(path.join(root, 'public', 'images', name + '.webp'));
    assert.equal((await image.arrayBuffer()).byteLength, local.length);
  }
  checks.push('All five production photographs: passed');
  const source = await request(productionUrl, '/src/app/contexts/AppContext.tsx');
  assert.ok(!(await source.text()).includes('function AppProvider'));
  checks.push('Production preview does not expose original application source: passed');
  console.log(checks.join('\n'));
} catch (error) {
  console.error('HTTP verification failed:', error);
  console.error('Completed checks:', checks.join('; '));
  process.exitCode = 1;
} finally {
  dev?.httpServer?.closeAllConnections();
  production?.httpServer?.closeAllConnections();
  if (dev) {
    let timer;
    const deadline = new Promise(resolve => { timer = setTimeout(() => { console.error('Timed out closing development server'); process.exitCode = 1; resolve(); }, 3000); });
    try { await Promise.race([dev.close(), deadline]); }
    finally { clearTimeout(timer); }
  }
  if (production) await new Promise((resolve, reject) => production.httpServer.close(error => error ? reject(error) : resolve()));
  if (envCreated) await unlink(envFile);
  if (outsideCreated) await unlink(outsideFile);
}
