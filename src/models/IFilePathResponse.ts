import FilePathResponseStatus from "../enums/FilePathResponseStatus";

export default interface IFilePathResponse {
    status: FilePathResponseStatus
    filePath: string,
}