import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IFileContentRequest from "../../models/file/IFIleContentRequest";
import IFileContentResponse from "../../models/file/IFileContentResponse";
import IpcKey from "../../models/IpcKey";

function sendContentFailureResponse() {
    const response: IFileContentResponse = {
        success: false,
        fileContent: null
    }

    WindowModule.sendFailure(IpcKey.FILE_CONTENT, response)
}

export default async function (request: IFileContentRequest) {
    const fileExists = StorageModule.tryCheckFileExists(request.filePath);

    if (!fileExists) {
        MainLoggingModule.logWarning("DirectoryContentRequestBehavior", `No File: ${request.filePath}`);
        sendContentFailureResponse();
        return;
    }

    try {
        const fileContent = await StorageModule.readFile(request.filePath);

        const message: IFileContentResponse = {
            success: true,
            fileContent
        };

        WindowModule.sendSuccess(IpcKey.FILE_CONTENT, message);
    } catch (e) {
        MainLoggingModule.logWarning("DirectoryContentRequestBehavior", `No File Content: ${request.filePath}`);
        sendContentFailureResponse();
    }
}