import IRequest from "../IRequest";

export default interface IFilePathPromptRequest extends IRequest {
    directoryPath: string,
    reasonForFilePath: string,
}