// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron/renderer'

contextBridge.exposeInMainWorld('electronAPI', {
    
    get: () => ipcRenderer.invoke('get'),
    getLiveUpdates: () => ipcRenderer.invoke('getLiveUpdates'),

});