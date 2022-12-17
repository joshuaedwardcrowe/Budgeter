import { BrowserWindow, dialog } from 'electron';
import IWindowConfiguration from "../models/IWindowConfiguration";

class WindowModule {
    windows: Map<string, BrowserWindow>;

    constructor() {
        this.windows = new Map();
    }

    getWindows(): BrowserWindow[] {
        return BrowserWindow.getAllWindows();
    }

    anyWindows(): boolean {
        return this.getWindows().length >= 1;
    }

    async createWindow(config: IWindowConfiguration) {
        const window = new BrowserWindow(config);
        this.windows.set(config.title, window);
        return window;
    }

    showErrorDialog(title: string, content: string): void {
        dialog.showErrorBox(title, content);
    }
}

export default new WindowModule();