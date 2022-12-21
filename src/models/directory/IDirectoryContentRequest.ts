import IRequest from "../IRequest";

export default interface IDirectoryContentRequest extends IRequest {
    directoryPath: string
}