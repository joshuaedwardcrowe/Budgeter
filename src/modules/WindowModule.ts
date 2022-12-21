import { BrowserWindow, dialog, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import MainLoggingModule from "./MainLoggingModule";
import IWindowConfiguration from "../models/window/IWindowConfiguration";
import IResponse from "../models/IResponse";
import IpcKey from "../models/IpcKey";
import IpcStatus from "../models/IpcStatus";

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

    sendSuccess(channel: IpcKey, response: IResponse) {
        const channelKey: string = this.generateChannelKey(channel, IpcStatus.SUCCESS);
        MainLoggingModule.logInfo("WindowModule", `Sent: ${channelKey}`);
        this.window.webContents.send(channelKey, response);
    }

    sendFailure(channel: IpcKey, response: IResponse) {
        const channelKey: string = this.generateChannelKey(channel, IpcStatus.FAILURE);
        MainLoggingModule.logWarning("WindowModule", `Sent: ${channelKey}`);
        this.window.webContents.send(channelKey, response);
    }

    private generateChannelKey(channel: IpcKey, status: IpcStatus): string {
        return `${channel}:${status}`;
    }
}

export default new WindowModule();