import { ipcRenderer } from "electron";
import RendererLoggingModule from "./RendererLoggingModule";

import IRequest from "../models/IRequest";
import IResponse from "../models/IResponse";
import IpcChannel from "../models/IpcChannel";
import IpcStatus from "../models/IpcStatus";

export default class RendererIpcModule {
    protected sendIpcMessage<TRequest extends IRequest>(channel: IpcChannel, request?: TRequest): void {
        const requestKey: string = this.generateChannelKey(channel, IpcStatus.REQUEST);
        RendererLoggingModule.logInfo("RendererIpcModule", `Sent: ${requestKey}`);
        ipcRenderer.send(requestKey, request);
    }

    protected async addIpcListeners<TResponse extends IResponse>(channel: IpcChannel): Promise<TResponse> {
        const successKey: string = this.generateChannelKey(channel, IpcStatus.SUCCESS);
        const failureKey: string = this.generateChannelKey(channel, IpcStatus.FAILURE);
        RendererLoggingModule.logInfo("RendererIpcModule", `Listening for: ${successKey} OR ${failureKey}`);
        const successListener: Promise<TResponse> = this.createIpcListener<TResponse>(successKey);
        const failureListener: Promise<TResponse> = this.createIpcListener<TResponse>(failureKey);
        const response: TResponse = await Promise.race<TResponse>([successListener, failureListener]);
        this.throwIpcError(channel, response);
        RendererLoggingModule.logInfo("RendererIpcModule", `Got: ${successKey}`);
        return response;
    }

    private generateChannelKey(channel: IpcChannel, type: string): string {
        return `${channel}:${type}`;
    }

    private throwIpcError(channel: IpcChannel, response: IResponse) {
        if (!response.success) {
            RendererLoggingModule.logInfo("RendererIpcModule", `Got: ${channel}:${IpcStatus.FAILURE}`);
            throw new Error(`'${channel}' Failed`);
        }
    }

    // TODO: Is there some way to constrain the channel key?
    private createIpcListener<TResponse extends IResponse>(channelKey: string): Promise<TResponse> {
        return new Promise((resolve) => {
            ipcRenderer.on(channelKey, (event, message) => resolve(message))
        })
    }
}