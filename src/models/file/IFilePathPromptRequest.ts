import IRequest from "../IRequest";

export default interface IFilePathPromptRequest extends IRequest {
    reasonForFilePath: string,
}