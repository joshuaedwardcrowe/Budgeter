import IRequest from "../IRequest";

export default interface IFileDeletionRequest extends IRequest {
    filePath: string
}