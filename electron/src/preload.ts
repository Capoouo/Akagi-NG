import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';

type IpcCallback = (event: IpcRendererEvent, ...args: unknown[]) => void;

contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, ...args: unknown[]) => {
    ipcRenderer.send(channel, ...args);
  },

  on: (channel: string, func: (...args: unknown[]) => void) => {
    const subscription: IpcCallback = (_event, ...args) => func(...args);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },

  invoke: (channel: string, ...args: unknown[]) => {
    return ipcRenderer.invoke(channel, ...args);
  },
});
