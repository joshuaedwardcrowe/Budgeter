import IpcSource from "./IpcSource";
import IpcKey from "./IpcKey";

export default interface IRequest {
    source: IpcSource;
    key: IpcKey;
}