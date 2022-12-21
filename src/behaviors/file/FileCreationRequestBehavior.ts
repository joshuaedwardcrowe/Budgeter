import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IFileCreationRequest from "../../models/file/IFileCreationRequest";
import IResponse from "../../models/IResponse";
import IpcKey from "../../models/IpcKey";

function sendContentFailureResponse() {
    const response: IResponse = {
        success: false
    }

    WindowModule.sendFailure(IpcKey.FILE_CREATION, response);
}

export default async function (request: IFileCreationRequest) {
    MainLoggingModule.logInfo("FileCreationRequestBehavior", `Got Request`);

    const fileExists = await StorageModule.tryCheckFileExists(request.filePath);

    if (fileExists) {
        MainLoggingModule.logWarning("FileCreationRequestBehavior", `File Exists: ${request.filePath}`);
        sendContentFailureResponse();
        return;
    }

    try {
        await StorageModule.createFile(request.filePath, request.fileContent);

        const response: IResponse = {
            success: true
        }

        WindowModule.sendSuccess(IpcKey.FILE_CREATION, response);
        MainLoggingModule.logInfo("FileCreationRequestBehavior", `Resolved: ${request.filePath}`);
    } catch (e) {
        MainLoggingModule.logWarning("FileCreationRequestBehavior", `Could Not Create File: ${request.filePath}`);
        sendContentFailureResponse();
    }
}