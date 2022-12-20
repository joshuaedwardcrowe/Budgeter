import MainLoggingModule from "../../modules/MainLoggingModule";
import MainLoggingLevel from "../../models/MainLoggingLevel";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IDirectoryContentRequest from "../../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../../models/directory/IDirectoryContentResponse";
import { IPC_DIRECTORY_CONTENT_SUCCESS_RESPONSE, IPC_DIRECTORY_CONTENT_FAILURE_RESPONSE } from "../../constants";

function sendContentFailureResponse() {
    const response: IDirectoryContentResponse = {
        success: false,
        directoryContent: []
    }

    WindowModule.window.webContents.send(IPC_DIRECTORY_CONTENT_FAILURE_RESPONSE, response);
}

async function tryCheckDirectoryExists(directoryPath: string) {
    try {
        MainLoggingModule.log(MainLoggingLevel.INFO, "DirectoryContentRequestBehavior", `Trying to Check Directory: ${directoryPath}`);
        await StorageModule.checkDirectoryExists(directoryPath);
    } catch (e) {
        MainLoggingModule.log(MainLoggingLevel.ERROR, "DirectoryContentRequestBehavior", `Failed to Check Directory: ${directoryPath}`);
        sendContentFailureResponse();
    }
}

async function tryReadDirectoryContent(directoryPath: string) {
    try {
        MainLoggingModule.log(MainLoggingLevel.INFO, "DirectoryContentRequestBehavior", `Trying to Get Content of Directory: ${directoryPath}`);
        return await StorageModule.readDirectoryContent(directoryPath);
    } catch (e) {
        MainLoggingModule.log(MainLoggingLevel.ERROR, "DirectoryContentRequestBehavior", `Failed to Get Content of Directory: ${directoryPath}`);
        sendContentFailureResponse();
    }
}

export default async function (request: IDirectoryContentRequest) {
    MainLoggingModule.log(MainLoggingLevel.INFO, "DirectoryContentRequestBehavior", `Got Request`);

     await tryCheckDirectoryExists(request.directoryPath);

     const directoryContent = await tryReadDirectoryContent(request.directoryPath);

     const response: IDirectoryContentResponse = {
         success: true,
         directoryContent
     };

     WindowModule.send(IPC_DIRECTORY_CONTENT_SUCCESS_RESPONSE, response);
     MainLoggingModule.log(MainLoggingLevel.INFO, "DirectoryContentRequestBehavior", `Sent Response, Content: ${response.directoryContent}`);
}