import {OpenDialogOptions, OpenDialogReturnValue } from "electron";
import os from "os";
import * as constants from "../constants";
import WindowModule from "../modules/WindowModule";
import IFilePathRequest from "../models/IFilePathRequest";
import IFilePathResponse from "../models/IFilePathResponse";

const HOME_DIR = os.homedir();

export default async function (request: IFilePathRequest) {
    const reasonForFile = constants.TEXT_SELECT_FILE.replace(
            constants.TEMPLATE_REASON_FOR_FILE,
            request.reasonForFile);

    const openFileOptions: OpenDialogOptions = {
        title: reasonForFile,
        defaultPath: `${HOME_DIR}/${constants.ENVIRONMENT_DOWNLOADS_FOLDER}`,
        buttonLabel: reasonForFile,
        message: "Idk what this message is",
        properties: ["openFile"]
    }

    const result: OpenDialogReturnValue = await WindowModule.showOpenFileDialog(openFileOptions);

    if (result.canceled) {
        const message: IFilePathResponse = {
            success: false,
            filePath: null
        };

        WindowModule.window.webContents.send(constants.IPC_FILE_PATH_NOT_FAILURE_RESPONSE, message);
        return;
    }

    const message: IFilePathResponse = {
        success: true,
        filePath: result.filePaths.pop()
    }

    WindowModule.window.webContents.send(constants.IPC_FILE_PATH_SUCCESS_RESPONSE, message);
}