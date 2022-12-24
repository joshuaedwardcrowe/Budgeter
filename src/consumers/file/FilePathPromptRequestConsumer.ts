import {OpenDialogOptions, OpenDialogReturnValue } from "electron";
import WindowModule from "../../modules/WindowModule";
import MainIpcModule from "../../modules/ipc/MainIpcModule";
import IFilePathPromptRequest from "../../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../../models/file/IFilePathPromptResponse";
import * as constants from "../../constants";
import MainConsumerLoggingModule from "../../modules/logging/MainConsumerLoggingModule";

export default async function FilePathRequestConsumer(logger: MainConsumerLoggingModule, { source, key, directoryPath, reasonForFilePath }: IFilePathPromptRequest) {
    logger.logInfo(`Got Request for ${reasonForFilePath} in ${directoryPath}`);

    const reasonForFile = constants.TEXT_SELECT_FILE.replace(constants.TEMPLATE_REASON_FOR_FILE, reasonForFilePath);

    const openFileOptions: OpenDialogOptions = {
        title: reasonForFile,
        defaultPath: directoryPath,
        buttonLabel: reasonForFile,
        message: "Idk what this message is",
        properties: ["openFile"]
    }

    logger.logInfo(`Opening File Dialog in ${openFileOptions.defaultPath}`);
    const result: OpenDialogReturnValue = await WindowModule.showOpenFileDialog(openFileOptions);

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
}