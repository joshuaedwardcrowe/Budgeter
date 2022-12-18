import {OpenDialogOptions, OpenDialogReturnValue } from "electron";
import * as constants from "../constants";
import WindowModule from "../modules/WindowModule";
import StorageModule from "../modules/StorageModule";
import IFilePathPromptRequest from "../models/IFilePathPromptRequest";
import IFilePathPromptResponse from "../models/IFilePathPromptResponse";

export default async function (request: IFilePathPromptRequest) {
    const reasonForFile = constants.TEXT_SELECT_FILE.replace(
            constants.TEMPLATE_REASON_FOR_FILE,
            request.reasonForFile);

    const openFileOptions: OpenDialogOptions = {
        title: reasonForFile,
        defaultPath: `${StorageModule.getHomeDirectoryPath()}/${constants.ENVIRONMENT_DOWNLOADS_FOLDER}`,
        buttonLabel: reasonForFile,
        message: "Idk what this message is",
        properties: ["openFile"]
    }

    const result: OpenDialogReturnValue = await WindowModule.showOpenFileDialog(openFileOptions);

    if (result.canceled) {
        const message: IFilePathPromptResponse = {
            success: false,
            filePath: null
        };

        WindowModule.window.webContents.send(constants.IPC_PROMPT_FILE_PATH_NOT_FAILURE_RESPONSE, message);
        return;
    }

    const message: IFilePathPromptResponse = {
        success: true,
        filePath: result.filePaths.pop()
    }

    WindowModule.window.webContents.send(constants.IPC_PROMPT_FILE_PATH_SUCCESS_RESPONSE, message);
}