import IpcSource from "./IpcSource";
import IpcKey from "./IpcKey";

export default interface IResponse {
    source: IpcSource;
    key: IpcKey;
    success: boolean
}