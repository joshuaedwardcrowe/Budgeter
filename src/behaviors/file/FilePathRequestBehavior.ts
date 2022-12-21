import {OpenDialogOptions, OpenDialogReturnValue } from "electron";
import MainLoggingModule from "../../modules/MainLoggingModule";
import WindowModule from "../../modules/WindowModule";
import StorageModule from "../../modules/StorageModule";
import IFilePathPromptRequest from "../../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../../models/file/IFilePathPromptResponse";
import * as constants from "../../constants";

export default async function (request: IFilePathPromptRequest) {
    MainLoggingModule.logInfo("FilePathRequestBehavior", `Got Request for ${request.reasonForFilePath}`);

    const reasonForFile = constants.TEXT_SELECT_FILE.replace(
            constants.TEMPLATE_REASON_FOR_FILE,
            request.reasonForFilePath);

    const openFileOptions: OpenDialogOptions = {
        title: reasonForFile,
        defaultPath: `${StorageModule.getHomeDirectoryPath()}/${constants.ENVIRONMENT_DOWNLOADS_FOLDER}`,
        buttonLabel: reasonForFile,
        message: "Idk what this message is",
        properties: ["openFile"]
    }

    MainLoggingModule.logInfo("FilePathRequestBehavior", `Opening File Dialog in ${openFileOptions.defaultPath}`);
    const result: OpenDialogReturnValue = await WindowModule.showOpenFileDialog(openFileOptions);

    if (result.canceled) {
        MainLoggingModule.logWarning("FilePathRequestBehavior", "File Dialog Closed");

        const message: IFilePathPromptResponse = {
            success: false,
            filePath: null
        };

        WindowModule.send(constants.IPC_PROMPT_FILE_PATH_FAILURE_RESPONSE, message);
        return;
    }

    const message: IFilePathPromptResponse = {
        success: true,
        filePath: result.filePaths.pop()
    }

    WindowModule.send(constants.IPC_PROMPT_FILE_PATH_SUCCESS_RESPONSE, message)
}