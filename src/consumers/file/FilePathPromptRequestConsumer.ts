import {OpenDialogOptions, OpenDialogReturnValue } from "electron";
import WindowModule from "../../modules/WindowModule";
import MainIpcModule from "../../modules/ipc/MainIpcModule";
import IFilePathPromptRequest from "../../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../../models/file/IFilePathPromptResponse";
import * as constants from "../../constants";
import MainConsumerLoggingModule from "../../modules/logging/MainConsumerLoggingModule";

export default async function FilePathPromptRequest(logger: MainConsumerLoggingModule, { source, key, directoryPath, reasonForFilePath }: IFilePathPromptRequest) {
    logger.logDebug(`Received File Path Prompt Request Request for ${reasonForFilePath} in ${directoryPath}`);

    const reasonForFile = constants.TEXT_SELECT_FILE.replace(constants.TEMPLATE_REASON_FOR_FILE, reasonForFilePath);

    const openFileOptions: OpenDialogOptions = {
        title: reasonForFile,
        defaultPath: directoryPath,
        buttonLabel: reasonForFile,
        message: "Idk what this message is",
        properties: ["openFile"]
    }

    logger.logDebug(`Opening File Dialog in ${openFileOptions.defaultPath}`);
    const result: OpenDialogReturnValue = await WindowModule.showOpenFileDialog(source, openFileOptions);

    if (result.canceled) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: true,
        })

        logger.logWarning(`File Dialog Closed`);

        return;
    }

    MainIpcModule.sendSuccess<IFilePathPromptResponse>({
        source,
        key,
        success: true,
        filePath: result.filePaths[0]
    })

    logger.logInfo(`Got File Path: ${result.filePaths[0]}`)
}