import IRequest from "../IRequest";

export default interface IFileCreationRequest extends IRequest {
    filePath: string,
    fileContent: string
}