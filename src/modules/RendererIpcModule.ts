import { ipcRenderer } from "electron";
import IRequest from "../models/IRequest";
import IResponse from "../models/IResponse";
import Channel from "../models/Channel";

const REQUEST = "request";
const RESPONSE_FAILURE = "response_failure";
const RESPONSE_SUCCESS = "response_success";

export default class RendererIpcModule {
    protected sendIpcMessage<TRequest extends IRequest>(channel: Channel, request?: TRequest): void {
        const requestKey: string = this.generateChannelKey(channel, REQUEST);
        ipcRenderer.send(requestKey, request);
    }

    protected async addIpcListeners<TResponse extends IResponse>(channel: Channel): Promise<TResponse> {
        const successKey: string = this.generateChannelKey(channel, RESPONSE_SUCCESS);
        const failureKey: string = this.generateChannelKey(channel, RESPONSE_FAILURE);
        const successListener: Promise<TResponse> = this.createIpcListener<TResponse>(successKey);
        const failureListener: Promise<TResponse> = this.createIpcListener<TResponse>(failureKey);
        const response: TResponse = await Promise.race<TResponse>([successListener, failureListener]);
        this.throwIpcError(channel, response);
        return response;
    }

    private generateChannelKey(channel: Channel, type: string): string {
        return `${channel}:${type}`;
    }

    private throwIpcError(channel: string, response: IResponse) {
        if (!response.success) {
            throw new Error(`'${channel}' Failed`);
        }
    }

    private createIpcListener<TResponse extends IResponse>(channel: string): Promise<TResponse> {
        return new Promise((resolve) => {
            ipcRenderer.on(channel, (event, message) => resolve(message))
        })
    }
}