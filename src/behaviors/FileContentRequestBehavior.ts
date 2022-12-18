import StorageModule from "../modules/StorageModule";
import WindowModule from "../modules/WindowModule";

import IFileContentRequest from "../models/IFIleContentRequest";

import * as constants from "../constants";
import IFileContentResponse from "../models/IFileContentResponse";

function sendContentFailureResponse() {
    const message: IFileContentResponse = {
        success: false,
        fileContent: null
    }

    WindowModule.window.webContents.send(constants.IPC_FILE_CONTENT_FAILURE_RESPONSE, message);
}

async function tryCheckFileExists(filePath: string) {
    try {
        return await StorageModule.readFile(filePath);
    } catch (e) {
        sendContentFailureResponse();
    }
}

async function tryReadFile(filePath: string) {
    try {
        return await StorageModule.readFile(filePath);
    } catch (e) {
        sendContentFailureResponse();
    }
}

export default async function (request: IFileContentRequest) {
    await tryCheckFileExists(request.filePath);

    const fileContent = await tryReadFile(request.filePath);

    const message: IFileContentResponse = {
        success: true,
        fileContent
    };

    WindowModule.window.webContents.send(constants.IPC_FILE_CONTENT_SUCCESS_RESPONSE, message);
}