import { ipcRenderer } from "electron";
import RendererLoggingModule from "./RendererLoggingModule";
import IRequest from "../models/IRequest";
import IResponse from "../models/IResponse";
import IpcKey from "../models/IpcKey";
import IpcStatus from "../models/IpcStatus";
import IpcChannel from "../models/IpcChannel";

export default class RendererIpcModule {
    protected sendIpcMessage<TRequest extends IRequest>(key: IpcKey, request?: TRequest): void {
        const requestKey = new IpcChannel(key, IpcStatus.REQUEST);
        RendererLoggingModule.logInfo("RendererIpcModule", `Sent: ${requestKey}`);
        ipcRenderer.send(requestKey.stringify(), request);
    }

    protected async addIpcListeners<TResponse extends IResponse>(channel: IpcKey): Promise<TResponse> {
        const successChannel = new IpcChannel(channel, IpcStatus.SUCCESS);
        const failureChannel = new IpcChannel(channel, IpcStatus.FAILURE);
        RendererLoggingModule.logInfo("RendererIpcModule", `Listening for: ${successChannel} OR ${failureChannel}`);
        const successListener: Promise<TResponse> = this.createIpcListener<TResponse>(successChannel);
        const failureListener: Promise<TResponse> = this.createIpcListener<TResponse>(failureChannel);
        const response: TResponse = await Promise.race<TResponse>([successListener, failureListener]);
        this.throwIpcError(channel, response);
        RendererLoggingModule.logInfo("RendererIpcModule", `Got: ${successChannel}`);
        return response;
    }

    private throwIpcError(channel: IpcKey, response: IResponse) {
        if (!response.success) {
            RendererLoggingModule.logInfo("RendererIpcModule", `Got: ${channel}:${IpcStatus.FAILURE}`);
            throw new Error(`'${channel}' Failed`);
        }
    }

    // TODO: Is there some way to constrain the channel key?
    private createIpcListener<TResponse extends IResponse>(channel: IpcChannel): Promise<TResponse> {
        const stringified: string = channel.stringify();

        return new Promise((resolve) => {
            ipcRenderer.on(stringified, (event, message) => resolve(message))
        });
    }
}