// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron/renderer'
import { ImportStatFileRequest } from './backend/types';

contextBridge.exposeInMainWorld('electronAPI', {
    
    get: () => ipcRenderer.invoke('get'),
    getLiveUpdates: () => ipcRenderer.invoke('getLiveUpdates'),
    importCards: () => ipcRenderer.invoke('importCards'),
    createLiveUpdate: (liveUpdateEffectiveDate: string) => ipcRenderer.invoke('createLiveUpdate', liveUpdateEffectiveDate),
    getExportedPtDataFiles: () => ipcRenderer.invoke('getExportedPtDataFiles'),
    importTournamentFile: (request: ImportStatFileRequest) => ipcRenderer.invoke('importTournamentFile', request),
    getTournamentTypes: () => ipcRenderer.invoke('getTournamentTypes'),

});