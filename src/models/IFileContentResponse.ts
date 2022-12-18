import IResponse from "./IResponse";

export default interface IFileContentResponse extends IResponse {
    fileContent: string
}