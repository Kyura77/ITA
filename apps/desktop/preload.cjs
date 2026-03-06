const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopBridge", {
  isDesktop: true,
  getMeta: () => ipcRenderer.invoke("desktop:get-meta"),
  openProjectFolder: () => ipcRenderer.invoke("desktop:open-project-folder"),
  openAnkiFolder: () => ipcRenderer.invoke("desktop:open-anki-folder"),
});