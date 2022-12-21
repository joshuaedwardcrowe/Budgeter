import IpcKey from "./IpcKey";
import IpcStatus from "./IpcStatus";

export default class IpcChannel {
    private readonly key: IpcKey
    private readonly status: IpcStatus

    constructor(key: IpcKey, status: IpcStatus) {
        this.key = key;
        this.status = status;
    }

    stringify(): string {
        return `${this.key}:${this.status}`;
    }
}