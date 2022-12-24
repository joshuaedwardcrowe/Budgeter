import { ipcRenderer } from "electron";
import RendererLoggingModule from "./RendererLoggingModule";
import IRequest from "../models/IRequest";
import IResponse from "../models/IResponse";
import IpcKey from "../models/IpcKey";
import IpcStatus from "../models/IpcStatus";
import IpcChannel from "../models/IpcChannel";

export default class RendererIpcModule {
    protected sendIpcMessage<TRequest extends IRequest>(request: TRequest): void {
        const requestChannel = new IpcChannel(request.key, IpcStatus.REQUEST);
        const requestChannelStringified = requestChannel.stringify();
        RendererLoggingModule.logInfo("RendererIpcModule", `Sent: ${requestChannelStringified}`);
        ipcRenderer.send(requestChannel.stringify(), request);
    }

    protected async addIpcListeners<TResponse extends IResponse>(channel: IpcKey): Promise<TResponse> {
        const successChannel = new IpcChannel(channel, IpcStatus.SUCCESS);
        const failureChannel = new IpcChannel(channel, IpcStatus.FAILURE);
        const successChannelStringified = successChannel.stringify();
        const failureChannelStringified = failureChannel.stringify();
        RendererLoggingModule.logInfo("RendererIpcModule", `Listening for: ${successChannelStringified} OR ${failureChannelStringified}`);
        const successListener: Promise<TResponse> = this.createIpcListener<TResponse>(successChannel);
        const failureListener: Promise<TResponse> = this.createIpcListener<TResponse>(failureChannel);
        const response: TResponse = await Promise.race<TResponse>([successListener, failureListener]);
        this.throwIpcError(channel, response);
        RendererLoggingModule.logInfo("RendererIpcModule", `Got: ${successChannelStringified}`);
        return response;
    }

    private throwIpcError(key: IpcKey, response: IResponse) {
        if (!response.success) {
            const failureChannel = new IpcChannel(key, IpcStatus.FAILURE);
            const failureChannelStringified = failureChannel.stringify();
            RendererLoggingModule.logInfo("RendererIpcModule", `Got: ${failureChannelStringified}`);
            throw new Error(`'${key}' Failed`);
        }
    }
    
    private createIpcListener<TResponse extends IResponse>(channel: IpcChannel): Promise<TResponse> {
        const stringified: string = channel.stringify();

        return new Promise((resolve) => {
            ipcRenderer.on(stringified, (event, message) => resolve(message))
        });
    }
}