import {OpenDialogOptions, OpenDialogReturnValue } from "electron";
import MainLoggingModule from "../../modules/MainLoggingModule";
import WindowModule from "../../modules/WindowModule";
import MainIpcModule from "../../modules/MainIpcModule";
import IFilePathPromptRequest from "../../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../../models/file/IFilePathPromptResponse";
import * as constants from "../../constants";

export default async function FilePathRequestBehavior({ source, key, directoryPath, reasonForFilePath }: IFilePathPromptRequest) {
    MainLoggingModule.logInfo(source, FilePathRequestBehavior.name, `Got Request for ${reasonForFilePath} in ${directoryPath}`);

    const reasonForFile = constants.TEXT_SELECT_FILE.replace(constants.TEMPLATE_REASON_FOR_FILE, reasonForFilePath);

    const openFileOptions: OpenDialogOptions = {
        title: reasonForFile,
        defaultPath: directoryPath,
        buttonLabel: reasonForFile,
        message: "Idk what this message is",
        properties: ["openFile"]
    }

    MainLoggingModule.logInfo(source, FilePathRequestBehavior.name, `Opening File Dialog in ${openFileOptions.defaultPath}`);
    const result: OpenDialogReturnValue = await WindowModule.showOpenFileDialog(openFileOptions);

    if (result.canceled) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: true,
        })

        MainLoggingModule.logWarning(source, FilePathRequestBehavior.name, `File Dialog Closed`);

        return;
    }

    MainIpcModule.sendSuccess<IFilePathPromptResponse>({
        source,
        key,
        success: true,
        filePath: result.filePaths[0]
    })
}