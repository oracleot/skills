#!/usr/bin/env node
/*
 * Reusable CDP smoke test for generated present-demo Electron applications.
 *
 * Launch Electron with `--remote-debugging-port=9222` before running this file.
 * Generated demos should preserve these audience-renderer hooks:
 *
 *   data-demo-surface="audience"
 *   data-demo-stage="opening|product|closing"
 *   data-demo-control="open-product|previous|next|notes|back|forward|reload|retry|go"
 *   data-demo-control="address" (an input)
 *   data-demo-current-step="<stable step id or index>"
 *   data-demo-browser-status="loading|live|offline"
 *   data-demo-browser-error (exact failed URL and error text when offline)
 *   data-demo-retry-mode="ignore-cache" (on the Retry control)
 *
 * Override DEMO_DEBUG_PORT when the app uses another debugging port. The test
 * owns two loopback fixture origins, so it is independent of product accounts.
 */

'use strict';

const http = require('node:http');
const assert = require('node:assert/strict');

const host = '127.0.0.1';
const debugPort = Number(process.env.DEMO_DEBUG_PORT || 9222);
const fixturePortA = Number(process.env.DEMO_FIXTURE_PORT_A || 43171);
const fixturePortB = Number(process.env.DEMO_FIXTURE_PORT_B || 43172);
const originA = `http://${host}:${fixturePortA}`;
const originB = `http://${host}:${fixturePortB}`;
const timeoutMs = Number(process.env.DEMO_SMOKE_TIMEOUT_MS || 15000);

if (typeof WebSocket === 'undefined') {
  throw new Error('This template requires a Node/Electron runtime with the global WebSocket API.');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fixturePage(name, linksTo) {
  return `<!doctype html><html><head><title>${name}</title></head><body>
    <main data-fixture="${name}"><h1>${name}</h1><a href="${linksTo}">Other origin</a></main>
  </body></html>`;
}

function createFixture(port, name, linksTo) {
  let server;
  let requests = 0;
  return {
    get requests() {
      return requests;
    },
    async start() {
      if (server?.listening) return;
      server = http.createServer((_request, response) => {
        requests += 1;
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
        response.end(fixturePage(name, linksTo));
      });
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, host, resolve);
      });
    },
    async stop() {
      if (!server?.listening) return;
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    },
  };
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Renderer evaluation failed');
    return result.result.value;
  }

  close() {
    this.socket?.close();
  }
}

async function targets() {
  const response = await fetch(`http://${host}:${debugPort}/json/list`);
  if (!response.ok) throw new Error(`CDP target discovery returned ${response.status}`);
  return response.json();
}

async function connectTarget(target) {
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Runtime.enable');
  return client;
}

async function waitFor(label, probe, timeout = timeoutMs) {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const value = await probe();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError.message}` : ''}`);
}

async function findRenderer(selector) {
  for (const target of await targets()) {
    if (target.type !== 'page' || !target.webSocketDebuggerUrl) continue;
    const client = await connectTarget(target);
    try {
      if (await client.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) {
        return { target, client };
      }
    } catch {}
    client.close();
  }
  return null;
}

async function matchingRendererTargets(selector) {
  const matches = [];
  for (const target of await targets()) {
    if (target.type !== 'page' || !target.webSocketDebuggerUrl) continue;
    const client = await connectTarget(target);
    try {
      if (await client.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) matches.push(target);
    } catch {}
    client.close();
  }
  return matches;
}

async function click(client, control) {
  const clicked = await client.evaluate(`(() => {
    const element = document.querySelector('[data-demo-control="${control}"]');
    if (!element) return false;
    element.click();
    return true;
  })()`);
  assert.equal(clicked, true, `Missing enabled ${control} control`);
}

async function navigate(client, url) {
  const accepted = await client.evaluate(`(() => {
    const input = document.querySelector('[data-demo-control="address"]');
    const go = document.querySelector('[data-demo-control="go"]');
    if (!input || !go) return false;
    input.value = ${JSON.stringify(url)};
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    go.click();
    return true;
  })()`);
  assert.equal(accepted, true, 'Editable address field and Go control are required');
}

async function browserTargetFor(origin) {
  return (await targets()).find((target) => target.type === 'page' && target.url.startsWith(origin));
}

async function browserState(client) {
  return client.evaluate(`(() => ({
    stage: document.querySelector('[data-demo-stage]')?.dataset.demoStage,
    status: document.querySelector('[data-demo-browser-status]')?.dataset.demoBrowserStatus,
    address: document.querySelector('[data-demo-control="address"]')?.value,
    error: document.querySelector('[data-demo-browser-error]')?.textContent?.trim() || ''
  }))()`);
}

async function presentationStep(client) {
  return client.evaluate(`(() => {
    const element = document.querySelector('[data-demo-current-step]');
    return element?.dataset.demoCurrentStep || element?.textContent?.trim() || '';
  })()`);
}

async function main() {
  const fixtureA = createFixture(fixturePortA, 'fixture-a', originB);
  const fixtureB = createFixture(fixturePortB, 'fixture-b', originA);
  const clients = [];
  try {
    await Promise.all([fixtureA.start(), fixtureB.start()]);
    const audience = await waitFor('audience renderer', () => findRenderer('[data-demo-surface="audience"]'));
    clients.push(audience.client);

    await click(audience.client, 'open-product');
    await waitFor('product stage', async () => (await browserState(audience.client)).stage === 'product');

    for (const control of ['back', 'forward', 'reload', 'address', 'go', 'notes']) {
      assert.equal(await audience.client.evaluate(`Boolean(document.querySelector('[data-demo-control="${control}"]'))`), true,
        `Product chrome is missing ${control}`);
    }

    await navigate(audience.client, originA);
    await waitFor('fixture A Live state', async () => {
      const state = await browserState(audience.client);
      return state.status === 'live' && state.address.startsWith(originA);
    });
    const productTarget = await waitFor('fixture A WebContents target', () => browserTargetFor(originA));
    const productTargetId = productTarget.id;

    await navigate(audience.client, originB);
    await waitFor('fixture B Live state', async () => {
      const state = await browserState(audience.client);
      return state.status === 'live' && state.address.startsWith(originB);
    });
    assert.equal((await browserTargetFor(originB)).id, productTargetId, 'Navigation recreated the product WebContents');

    await click(audience.client, 'back');
    await waitFor('Back navigation to fixture A', async () => (await browserState(audience.client)).address.startsWith(originA));
    assert.equal((await browserTargetFor(originA)).id, productTargetId, 'Back navigation recreated the product WebContents');
    await click(audience.client, 'forward');
    await waitFor('Forward navigation to fixture B', async () => (await browserState(audience.client)).address.startsWith(originB));
    const requestsBeforeReload = fixtureB.requests;
    await click(audience.client, 'reload');
    await waitFor('Reloaded fixture B Live state', async () => {
      return fixtureB.requests > requestsBeforeReload && (await browserState(audience.client)).status === 'live';
    });

    await click(audience.client, 'notes');
    const notes = await waitFor('Presenter Notes renderer', () => findRenderer('[data-demo-surface="notes"]'));
    clients.push(notes.client);
    const stepBeforeNotesNavigation = await presentationStep(audience.client);
    assert.ok(stepBeforeNotesNavigation, 'Audience renderer is missing data-demo-current-step');
    assert.equal(await presentationStep(notes.client), stepBeforeNotesNavigation, 'Presenter Notes is not synchronized');
    await click(notes.client, 'next');
    await waitFor('Presenter Notes-driven state change', async () => (await presentationStep(audience.client)) !== stepBeforeNotesNavigation);
    await click(notes.client, 'previous');
    await waitFor('Presenter Notes-driven state restore', async () => (await presentationStep(audience.client)) === stepBeforeNotesNavigation);
    assert.equal((await browserTargetFor(originB)).id, productTargetId, 'Notes navigation recreated the product WebContents');
    const stepBeforeNotesClose = await presentationStep(audience.client);
    await click(audience.client, 'notes');
    assert.equal((await matchingRendererTargets('[data-demo-surface="notes"]')).length, 1,
      'Repeated activation created more than one Presenter Notes window');
    await notes.client.send('Page.close');
    notes.client.close();
    await waitFor('Presenter Notes close', async () => (await matchingRendererTargets('[data-demo-surface="notes"]')).length === 0);
    await click(audience.client, 'notes');
    const reopenedNotes = await waitFor('reopened Presenter Notes', () => findRenderer('[data-demo-surface="notes"]'));
    clients.push(reopenedNotes.client);
    assert.equal(await presentationStep(reopenedNotes.client), stepBeforeNotesClose,
      'Reopening Presenter Notes changed the current chapter');
    assert.equal((await browserTargetFor(originB)).id, productTargetId, 'Notes lifecycle recreated the product WebContents');

    await fixtureB.stop();
    await click(audience.client, 'reload');
    const offline = await waitFor('Offline state', async () => {
      const state = await browserState(audience.client);
      return state.status === 'offline' && state.error.includes(originB) && state;
    });
    assert.ok(offline.error.length > originB.length, 'Offline state must include the failed URL and error detail');

    await fixtureB.start();
    assert.equal(await audience.client.evaluate(`document.querySelector('[data-demo-control="retry"]')?.dataset.demoRetryMode`),
      'ignore-cache', 'Retry must declare the cache-bypassing main-process path');
    await click(audience.client, 'retry');
    await waitFor('cache-bypassing recovery to Live', async () => (await browserState(audience.client)).status === 'live');
    assert.equal((await browserTargetFor(originB)).id, productTargetId, 'Recovery recreated the product WebContents');

    for (let index = 0; index < 20 && (await browserState(audience.client)).stage !== 'closing'; index += 1) {
      await click(audience.client, 'next');
      await sleep(100);
    }
    assert.equal((await browserState(audience.client)).stage, 'closing', 'Next did not reach the closing stage');
    assert.equal((await targets()).some((target) => target.id === productTargetId), true,
      'The product WebContents did not survive the closing chapter');

    process.stdout.write('present-demo runtime smoke: PASS\n');
  } finally {
    for (const client of clients) client.close();
    await Promise.allSettled([fixtureA.stop(), fixtureB.stop()]);
  }
}

main().catch((error) => {
  process.stderr.write(`present-demo runtime smoke: FAIL\n${error.stack || error.message}\n`);
  process.exitCode = 1;
});
