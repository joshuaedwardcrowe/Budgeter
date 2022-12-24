import { ipcMain } from "electron";
import MainLoggingModule from "../logging/MainLoggingModule";
import WindowModule from "../WindowModule";
import IpcChannel from "../../models/IpcChannel";
import IResponse from "../../models/IResponse";
import IpcStatus from "../../models/IpcStatus";
import IpcSource from "../../models/IpcSource";
import IRequest from "../../models/IRequest";
import IpcKey from "../../models/IpcKey";
import MainConsumerLoggingModule from "../logging/MainConsumerLoggingModule";

export default class MainIpcModule {
    static on<TRequest extends IRequest>(key: IpcKey, handler: (logging: MainConsumerLoggingModule, request: TRequest) => Promise<void>): void {
        const requestChannel = new IpcChannel(key, IpcStatus.REQUEST);
        const requestChannelStringified: string = requestChannel.stringify();

        ipcMain.on(requestChannelStringified, (_, r: TRequest) => {
            const logging = new MainConsumerLoggingModule(r.source, r.key, handler.name);
            return handler(logging, r);
        });
    }
    static sendSuccess<TResponse extends IResponse>(response: TResponse): void {
        const successChannel = new IpcChannel(response.key, IpcStatus.SUCCESS);
        const successChannelStringified = successChannel.stringify();
        MainLoggingModule.logInfo(IpcSource.Main, "MainIpcModule", `Sent: ${successChannelStringified}`);
        WindowModule.sendMessage(response.source, successChannelStringified, response);
    }
    static sendFailure(response: IResponse): void {
        const failureChannel = new IpcChannel(response.key, IpcStatus.FAILURE);
        const failureChannelStringified = failureChannel.stringify();
        MainLoggingModule.logInfo(IpcSource.Main, "MainIpcModule", `Sent: ${failureChannelStringified}`);
        WindowModule.sendMessage(response.source, failureChannelStringified, response);
    }
}