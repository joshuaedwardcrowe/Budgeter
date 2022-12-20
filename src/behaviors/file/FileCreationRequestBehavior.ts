import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";

import IFileCreationRequest from "../../models/IFileCreationRequest";
import IResponse from "../../models/IResponse";

import * as constants from "../../constants";

function sendContentFailureResponse() {
    const message: IResponse = {
        success: false
    }

    WindowModule.send(constants.IPC_FILE_CREATION_FAILURE_RESPONSE, message);
}

async function tryCheckFileDoesntExist(filePath: string) {
    try {
        // If file exists, it wont throw an error
        await StorageModule.checkFileExists(filePath);
        sendContentFailureResponse();
    } catch (e) {
        return;
    }
}

async function tryCheckFileExists(filePath: string) {
    try {
        return await StorageModule.checkFileExists(filePath);
    } catch (e) {
        sendContentFailureResponse();
    }
}

async function tryCreateFile(filePath: string, fileContent: string) {
    try {
        await StorageModule.createFile(filePath, fileContent);
    } catch (e) {
        sendContentFailureResponse();
    }
}

export default async function (request: IFileCreationRequest) {
    await tryCheckFileDoesntExist(request.filePath);

    await tryCreateFile(request.filePath, request.fileContent);

    await tryCheckFileExists(request.filePath);

    const message: IResponse = {
        success: true
    }

    WindowModule.send(constants.IPC_FILE_CREATION_SUCCESS_RESPONSE, message);
}