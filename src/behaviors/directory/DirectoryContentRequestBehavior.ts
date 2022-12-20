import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IDirectoryContentRequest from "../../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../../models/directory/IDirectoryContentResponse";
import {IPC_DIRECTORY_CONTENT_FAILURE_RESPONSE, IPC_DIRECTORY_CONTENT_SUCCESS_RESPONSE} from "../../constants";

function sendContentFailureResponse() {
    const response: IDirectoryContentResponse = {
        success: false,
        directoryContent: []
    }

    WindowModule.send(IPC_DIRECTORY_CONTENT_FAILURE_RESPONSE, response);
}

export default async function (request: IDirectoryContentRequest) {
    const directoryExists = await StorageModule.tryCheckDirectoryExists(request.directoryPath);

    if (!directoryExists) {
        MainLoggingModule.logWarning("DirectoryContentRequestBehavior", `No Directory: ${request.directoryPath}`);
        sendContentFailureResponse();
        return;
    }

    try {
        const directoryContent = await StorageModule.readDirectoryContent(request.directoryPath);

        const response: IDirectoryContentResponse = {
            success: true,
            directoryContent
        };

        WindowModule.send(IPC_DIRECTORY_CONTENT_SUCCESS_RESPONSE, response);
        MainLoggingModule.logInfo("DirectoryContentRequestBehavior", `Resolved: ${response.directoryContent}`);
    } catch (e) {
        MainLoggingModule.logWarning("DirectoryContentRequestBehavior", `Failed Read Directory Content: ${request.directoryPath}`);
        sendContentFailureResponse();
    }
}
