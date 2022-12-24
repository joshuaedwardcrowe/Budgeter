import { ipcMain } from "electron";
import MainLoggingModule from "./logging/MainLoggingModule";
import WindowModule from "./WindowModule";
import IpcChannel from "../models/IpcChannel";
import IResponse from "../models/IResponse";
import IpcStatus from "../models/IpcStatus";
import IpcSource from "../models/IpcSource";
import IRequest from "../models/IRequest";
import IpcKey from "../models/IpcKey";
import IMainBehaviorLoggingModule from "./logging/IMainBehaviorLoggingModule";
import MainBehaviorLoggingModule from "./logging/MainBehaviorLoggingModule";

export default class MainIpcModule {
    static on<TRequest extends IRequest>(key: IpcKey, handler: (logging: IMainBehaviorLoggingModule, request: TRequest) => Promise<void>): void {
        const requestChannel = new IpcChannel(key, IpcStatus.REQUEST);
        const requestChannelStringified: string = requestChannel.stringify();

        ipcMain.on(requestChannelStringified, (_, r: TRequest) => {
            const logging = new MainBehaviorLoggingModule(r.source, r.key, handler.name);
            return handler(logging, r);
        });
    }
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