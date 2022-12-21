import IRequest from "../IRequest";

export default interface IFileContentRequest extends IRequest {
    filePath: string
}