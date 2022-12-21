import { BrowserWindow, dialog, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import MainLoggingModule from "./MainLoggingModule";
import IWindowConfiguration from "../models/window/IWindowConfiguration";
import IResponse from "../models/IResponse";
import Channel from "../models/Channel";

const RESPONSE_FAILURE = "response_failure";
const RESPONSE_SUCCESS = "response_success";

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

    sendSuccess(channel: Channel, response: IResponse) {
        const channelKey: string = this.generateChannelKey(channel, RESPONSE_SUCCESS);
        MainLoggingModule.logInfo("WindowModule", `Sent: ${channelKey}`);
        this.window.webContents.send(channelKey, response);
    }

    sendFailure(channel: Channel, response: IResponse) {
        const channelKey: string = this.generateChannelKey(channel, RESPONSE_SUCCESS);
        MainLoggingModule.logWarning("WindowModule", `Sent: ${channelKey}`);
        this.window.webContents.send(channelKey, response);
    }

    private generateChannelKey(channel: Channel, type: string): string {
        return `${channel}:${type}`;
    }
}

export default new WindowModule();