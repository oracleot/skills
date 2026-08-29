const { app, BrowserWindow, WebContentsView, ipcMain, session, clipboard } = require('electron');
const path = require('node:path');
const theme = require('./shared/demo-theme.cjs');
const runbook = require('./shared/runbook.cjs');

let audienceWindow;
let notesWindow;
let productView;
let presentation = { phase: 'opening', stepIndex: 0 };
let browser = { status: 'loading', address: '', error: '' };
const initialUrl = process.env.DEMO_URL || ''; // ADAPT: set the exact environment URL confirmed by the user.

const safeState = () => ({ presentation, browser, theme, runbook });
const broadcast = () => BrowserWindow.getAllWindows().forEach((window) => window.webContents.send('demo:state', safeState()));
const isHttpUrl = (value) => { try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:'; } catch { return false; } };

function resizeProduct(bounds) {
  if (!productView || !audienceWindow || !bounds) return;
  const width = Math.max(0, Math.floor(bounds.width || 0));
  const height = Math.max(0, Math.floor(bounds.height || 0));
  productView.setBounds({ x: Math.max(0, Math.floor(bounds.x || 0)), y: Math.max(0, Math.floor(bounds.y || 0)), width, height });
  productView.setVisible(presentation.phase === 'product' && width > 0 && height > 0);
}

function createProductView() {
  const partition = 'present-demo-session';
  const demoSession = session.fromPartition(partition, { cache: true });
  demoSession.setPermissionCheckHandler(() => false);
  demoSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  productView = new WebContentsView({ webPreferences: { partition, contextIsolation: true, sandbox: true, nodeIntegration: false } });
  audienceWindow.contentView.addChildView(productView);
  productView.webContents.on('did-start-navigation', (_event, url, _isInPlace, isMainFrame) => {
    if (!isMainFrame) return;
    browser = { status: 'loading', address: url, error: '' }; broadcast();
  });
  productView.webContents.on('did-navigate', (_event, url) => { browser = { status: 'live', address: url, error: '' }; broadcast(); });
  productView.webContents.on('did-fail-load', (_event, code, description, url, isMainFrame) => {
    if (!isMainFrame || code === -3) return;
    browser = { status: 'offline', address: url, error: `${url} — ${description} (${code})` }; broadcast();
  });
  productView.webContents.setWindowOpenHandler(({ url }) => isHttpUrl(url) ? (productView.webContents.loadURL(url), { action: 'deny' }) : { action: 'deny' });
  if (!isHttpUrl(initialUrl)) {
    browser = { status: 'offline', address: '', error: 'Demo environment URL is not configured.' };
    broadcast();
    return;
  }
  productView.webContents.loadURL(initialUrl);
}

function createAudienceWindow() {
  audienceWindow = new BrowserWindow({ width: 1440, height: 900, minWidth: 900, minHeight: 600, show: false, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, sandbox: true, nodeIntegration: false } });
  audienceWindow.loadFile(path.join(__dirname, 'renderer', 'audience.html'));
  audienceWindow.once('ready-to-show', () => audienceWindow.show());
  audienceWindow.on('closed', () => { audienceWindow = null; productView = null; });
  createProductView();
}

function openNotes() {
  if (notesWindow && !notesWindow.isDestroyed()) return notesWindow.focus();
  notesWindow = new BrowserWindow({ width: 560, height: 780, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, sandbox: true, nodeIntegration: false } });
  notesWindow.loadFile(path.join(__dirname, 'renderer', 'notes.html'));
  notesWindow.on('closed', () => { notesWindow = null; });
}

ipcMain.handle('demo:get-state', () => safeState());
ipcMain.handle('demo:previous', () => {
  if (presentation.phase === 'closing') presentation = { phase: 'product', stepIndex: Math.max(0, runbook.steps.length - 1) };
  else if (presentation.phase === 'product' && presentation.stepIndex > 0) presentation = { phase: 'product', stepIndex: presentation.stepIndex - 1 };
  else if (presentation.phase === 'product') presentation = { phase: 'opening', stepIndex: 0 };
  broadcast();
});
ipcMain.handle('demo:next', () => {
  if (presentation.phase === 'opening') presentation = runbook.steps.length ? { phase: 'product', stepIndex: 0 } : { phase: 'closing', stepIndex: 0 };
  else if (presentation.phase === 'product' && presentation.stepIndex < runbook.steps.length - 1) presentation = { phase: 'product', stepIndex: presentation.stepIndex + 1 };
  else if (presentation.phase === 'product') presentation = { phase: 'closing', stepIndex: Math.max(0, runbook.steps.length - 1) };
  broadcast();
});
ipcMain.handle('demo:open-notes', () => openNotes());
ipcMain.handle('demo:copy-prompt', (_event, value) => { if (typeof value === 'string' && value.length < 10000) clipboard.writeText(value); });
ipcMain.on('demo:set-browser-bounds', (_event, bounds) => { if (bounds && typeof bounds === 'object') resizeProduct(bounds); });
ipcMain.handle('browser:navigate', (_event, url) => { if (!isHttpUrl(url)) throw new Error('Enter a valid HTTP or HTTPS URL.'); return productView.webContents.loadURL(url); });
ipcMain.handle('browser:back', () => { const history = productView.webContents.navigationHistory; if (history.canGoBack()) history.goBack(); });
ipcMain.handle('browser:forward', () => { const history = productView.webContents.navigationHistory; if (history.canGoForward()) history.goForward(); });
ipcMain.handle('browser:reload', () => productView.webContents.reload());
ipcMain.handle('browser:retry', () => productView.webContents.reloadIgnoringCache());

app.whenReady().then(createAudienceWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!audienceWindow) createAudienceWindow(); });
