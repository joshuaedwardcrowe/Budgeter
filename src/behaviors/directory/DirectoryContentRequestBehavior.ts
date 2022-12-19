import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import * as constants from "../../constants";
import IDirectoryContentRequest from "../../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../../models/directory/IDirectoryContentResponse";

function sendContentFailureResponse() {
    const response: IDirectoryContentResponse = {
        success: false,
        directoryContent: []
    }

    WindowModule.window.webContents.send(constants.IPC_DIRECTORY_CONTENT_FAILURE_RESPONSE, response);
}

async function tryCheckDirectoryExists(directoryPath: string) {
    try {
        await StorageModule.checkDirectoryExists(directoryPath);
    } catch (e) {
        sendContentFailureResponse();
    }
}

async function tryReadDirectoryContent(directoryPath: string) {
    try {
        return await StorageModule.readDirectoryContent(directoryPath);
    } catch (e) {
        sendContentFailureResponse();
    }
}

export default async function (request: IDirectoryContentRequest) {
     await tryCheckDirectoryExists(request.directoryPath);

     const directoryContent = await tryReadDirectoryContent(request.directoryPath);

     const response: IDirectoryContentResponse = {
         success: true,
         directoryContent
     };

     // TODO: Reduce this call.
     WindowModule.window.webContents.send(constants.IPC_DIRECTORY_CONTENT_SUCCESS_RESPONSE, response);
}