import { ipcRenderer } from "electron";
import IRequest from "../models/IRequest";
import IResponse from "../models/IResponse";
import Channel from "../models/Channel";

const REQUEST = "request";
const RESPONSE_FAILURE = "response_failure";
const RESPONSE_SUCCESS = "response_success";

export default class RendererIpcModule {
    protected sendIpcMessage<TRequest extends IRequest>(channel: Channel, request: TRequest): void {
        ipcRenderer.send(`${channel}:${REQUEST}`, request);
    }

    protected async addIpcListeners<TResponse extends IResponse>(channel: Channel): Promise<TResponse> {
        const successListener = this.createIpcListener<TResponse>(`${channel}:${RESPONSE_SUCCESS}`);
        const failureListener = this.createIpcListener<TResponse>(`${channel}:${RESPONSE_FAILURE}`);
        const response = await Promise.race<TResponse>([successListener, failureListener]);
        this.throwIpcError(channel, response);
        return response;
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