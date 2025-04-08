// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

console.log("here");
contextBridge.exposeInMainWorld("electronAPI", {
  getIp: () => ipcRenderer.invoke("getIp"),
  getDesktopSources: (types) => ipcRenderer.invoke("getScreenSources", types),
  // getSources: (opts) => desktopCapturer.getSources(opts),
  // Removed getRtpCapabilities and createDevice as they are now handled in the renderer
});
