const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('demo', {
  getState: () => ipcRenderer.invoke('demo:get-state'),
  onState: (callback) => ipcRenderer.on('demo:state', (_event, state) => callback(state)),
  previous: () => ipcRenderer.invoke('demo:previous'),
  next: () => ipcRenderer.invoke('demo:next'),
  openNotes: () => ipcRenderer.invoke('demo:open-notes'),
  copyPrompt: (value) => ipcRenderer.invoke('demo:copy-prompt', value),
  setBrowserBounds: (bounds) => ipcRenderer.send('demo:set-browser-bounds', bounds),
  navigate: (url) => ipcRenderer.invoke('browser:navigate', url),
  back: () => ipcRenderer.invoke('browser:back'),
  forward: () => ipcRenderer.invoke('browser:forward'),
  reload: () => ipcRenderer.invoke('browser:reload'),
  retry: () => ipcRenderer.invoke('browser:retry')
});
