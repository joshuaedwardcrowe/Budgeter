import {OpenDialogOptions, OpenDialogReturnValue} from "electron";
import os from "os";
import WindowModule from "../modules/WindowModule";
import IFilePathRequest from "../models/IFilePathRequest";
import IFilePathResponse from "../models/IFilePathResponse";
import FilePathResponseStatus from "../enums/FilePathResponseStatus";
import * as constants from "../constants";
import IpcRendererEvent = Electron.IpcRendererEvent;

const HOME_DIR = os.homedir();

export default async function (event: IpcRendererEvent, request: IFilePathRequest) {

    const reasonForFile = constants.TEXT_SELECT_FILE.replace(
            constants.TEMPLATE_REASON_FOR_FILE,
            request.reasonForFile);
    console.log(reasonForFile);

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
            status: FilePathResponseStatus.NotLocated,
            filePath: null
        };

        WindowModule.window.webContents.send(constants.IPC_FILE_PATH_NOT_LOCATED, message);
        return;
    }

    const message: IFilePathResponse = {
        status: FilePathResponseStatus.Located,
        filePath: result.filePaths.pop()
    }

    WindowModule.window.webContents.send(constants.IPC_FILE_PATH_LOCATED, message);
}