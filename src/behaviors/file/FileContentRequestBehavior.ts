import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IFileContentRequest from "../../models/file/IFIleContentRequest";
import IFileContentResponse from "../../models/file/IFileContentResponse";
import * as constants from "../../constants";

function sendContentFailureResponse() {
    const message: IFileContentResponse = {
        success: false,
        fileContent: null
    }

    WindowModule.window.webContents.send(constants.IPC_FILE_CONTENT_FAILURE_RESPONSE, message);
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

        WindowModule.send(constants.IPC_FILE_CONTENT_SUCCESS_RESPONSE, message);
    } catch (e) {
        MainLoggingModule.logWarning("DirectoryContentRequestBehavior", `No File Content: ${request.filePath}`);
        sendContentFailureResponse();
    }
}