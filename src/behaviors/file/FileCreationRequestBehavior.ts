import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IFileCreationRequest from "../../models/file/IFileCreationRequest";
import IResponse from "../../models/IResponse";
import * as constants from "../../constants";

function sendContentFailureResponse() {
    const message: IResponse = {
        success: false
    }

    WindowModule.send(constants.IPC_FILE_CREATION_FAILURE_RESPONSE, message);
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

        WindowModule.send(constants.IPC_FILE_CREATION_SUCCESS_RESPONSE, response);
        MainLoggingModule.logInfo("FileCreationRequestBehavior", `Resolved: ${request.filePath}`);
    } catch (e) {
        MainLoggingModule.logWarning("FileCreationRequestBehavior", `Could Not Create File: ${request.filePath}`);
        sendContentFailureResponse();
    }
}