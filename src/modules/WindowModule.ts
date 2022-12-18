import { BrowserWindow, dialog, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import IWindowConfiguration from "../models/IWindowConfiguration";

class WindowModule {
    window: BrowserWindow;

    getWindows(): BrowserWindow[] {
        return BrowserWindow.getAllWindows();
    }

    anyWindows(): boolean {
        return this.getWindows().length >= 1;
    }

    async createWindow(config: IWindowConfiguration) {
        this.window = new BrowserWindow(config);
        return this.window;
    }

    showErrorDialog(title: string, content: string): void {
        dialog.showErrorBox(title, content);
    }

    showOpenFileDialog(configuration: OpenDialogOptions): Promise<OpenDialogReturnValue> {
        return dialog.showOpenDialog(this.window, configuration);
    }
}

export default new WindowModule();