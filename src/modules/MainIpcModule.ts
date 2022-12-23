import MainLoggingModule from "./MainLoggingModule";
import WindowModule from "./WindowModule";
import IpcChannel from "../models/IpcChannel";
import IResponse from "../models/IResponse";
import IpcStatus from "../models/IpcStatus";
import IpcSource from "../models/IpcSource";

export default class MainIpcModule {
    static sendSuccess<TResponse extends IResponse>(response: TResponse): void {
        const channel = new IpcChannel(response.key, IpcStatus.SUCCESS);
        const stringified = channel.stringify();
        MainLoggingModule.logInfo(IpcSource.Main, "MainIpcModule", `Sent: ${stringified}`);
        WindowModule.window.webContents.send(stringified, response);
    }
    static sendFailure(response: IResponse): void {
        const channel = new IpcChannel(response.key, IpcStatus.FAILURE);
        const stringified = channel.stringify();
        MainLoggingModule.logInfo(IpcSource.Main, "MainIpcModule", `Sent: ${stringified}`);
        WindowModule.window.webContents.send(stringified, response);
    }
}