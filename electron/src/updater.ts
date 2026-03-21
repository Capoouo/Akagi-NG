import { app, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

import type { WindowManager } from './window-manager';

export class UpdaterManager {
  constructor(private windowManager: WindowManager) {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;

    this.setupListeners();
    this.setupIpcHandlers();
  }

  public checkForUpdates() {
    if (!app.isPackaged) {
      console.log('[Updater] Running in dev mode, skipping auto-update check.');
      return;
    }

    autoUpdater.checkForUpdates().catch((err) => {
      console.error('[Updater] Error checking for updates', err);
    });
  }

  private setupListeners() {
    autoUpdater.on('update-available', (info) => {
      this.notifyWindow('app:update-available', info.version);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      this.notifyWindow('app:update-progress', progressObj);
    });

    autoUpdater.on('update-downloaded', () => {
      this.notifyWindow('app:update-downloaded');
    });

    autoUpdater.on('error', (err) => {
      console.error('[Updater] Error:', err);
    });
  }

  private setupIpcHandlers() {
    ipcMain.handle('app:start-download', async () => {
      await autoUpdater.downloadUpdate();
    });

    ipcMain.handle('app:install-update', () => {
      autoUpdater.quitAndInstall(false, true);
    });
  }

  private notifyWindow(channel: string, data?: unknown) {
    const mainWin = this.windowManager.getMainWindow();
    if (mainWin && !mainWin.isDestroyed()) {
      mainWin.webContents.send(channel, data);
    }
  }
}
