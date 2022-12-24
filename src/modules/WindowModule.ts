import { BrowserWindow, dialog, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import IWindowConfiguration from "../models/window/IWindowConfiguration";
import IpcSource from "../models/IpcSource";
import IResponse from "../models/IResponse";

class WindowModule {
    windows: Map<IpcSource, BrowserWindow>;

    constructor() {
        this.windows = new Map<IpcSource, BrowserWindow>();
    }

    getWindows(): BrowserWindow[] {
        return BrowserWindow.getAllWindows();
    }

    anyWindows(): boolean {
        return this.getWindows().length >= 1;
    }

    async createWindow(config: IWindowConfiguration) {
        const window = new BrowserWindow(config);
        this.windows.set(config.source, window);
        return window;
    }

    showErrorDialog(title: string, content: string): void {
        dialog.showErrorBox(title, content);
    }

    showOpenFileDialog(source: IpcSource, configuration: OpenDialogOptions): Promise<OpenDialogReturnValue> {
        const window = this.windows.get(source);
        return dialog.showOpenDialog(window, configuration);
    }

    sendMessage(source: IpcSource, channel: string, response: IResponse) {
        const window = this.windows.get(source);
        window.webContents.send(channel, response);
    }
}

export default new WindowModule();