import MainLoggingModule from "./MainLoggingModule";
import WindowModule from "./WindowModule";
import IpcKey from "../models/IpcKey";
import IpcChannel from "../models/IpcChannel";
import IResponse from "../models/IResponse";
import IpcStatus from "../models/IpcStatus";

export default class MainIcpModule {
    static sendSuccess(key: IpcKey, response?: IResponse): void {
        if (!response) {
            response = {
                success: true
            }
        }

        const channel = new IpcChannel(key, IpcStatus.SUCCESS);
        const stringified = channel.stringify();
        MainLoggingModule.logInfo("MainIpcModule", `Sent: ${stringified}`);
        WindowModule.window.webContents.send(stringified, response);
    }
    static sendFailure(key: IpcKey, response?: IResponse): void {
        if (!response) {
            response = {
                success: false
            }
        }

        const channel = new IpcChannel(key, IpcStatus.FAILURE);
        const stringified = channel.stringify();
        MainLoggingModule.logInfo("MainIpcModule", `Sent: ${stringified}`);
        WindowModule.window.webContents.send(stringified, response);
    }
}