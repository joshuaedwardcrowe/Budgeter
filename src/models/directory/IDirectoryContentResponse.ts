import IResponse from "../IResponse";

export default interface IDirectoryContentResponse extends IResponse {
    directoryContent: string[]
}