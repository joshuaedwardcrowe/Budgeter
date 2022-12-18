import IMessage from "./IMessage";

export default interface IFileContentResponse extends IMessage {
    fileContent: string
}