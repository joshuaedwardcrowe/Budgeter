// See the Electron documentation for details on how to use preload scripts:
import { ipcRenderer, contextBridge } from "electron";
import * as constants from "./constants";
import IpcRendererEvent = Electron.IpcRendererEvent;
import IFilePathRequest from "./models/IFilePathRequest";
import IFilePathResponse from "./models/IFilePathResponse";
import IFileContentRequest from "./models/IFIleContentRequest";
import IFileContentResponse from "./models/IFileContentResponse";

function askForFilePath(reasonForFile: string): void {
    const request: IFilePathRequest = { reasonForFile };
    ipcRenderer.send(constants.IPC_FILE_PATH_REQUEST, request);
}

async function waitForFilePath(): Promise<string> {
    const message = await addIpcListener<IFilePathResponse>(constants.IPC_FILE_PATH_SUCCESS_RESPONSE);
    return message.filePath;
}

function askForFileContent(filePath: string): void {
    const request: IFileContentRequest = { filePath };
    ipcRenderer.send(constants.IPC_FILE_CONTENT_REQUEST, request);
}

async function waitForFileContent(): Promise<string> {
    const message = await addIpcListener<IFileContentResponse>(constants.IPC_FILE_CONTENT_SUCCESS_RESPONSE)
    return message.fileContent;
}

async function addIpcListener<TMessage>(channel: string): Promise<TMessage> {
    return new Promise((resolve, reject) => {
        ipcRenderer.on(channel, (event: IpcRendererEvent, message: TMessage) => {
            if (!message) {
                reject();
            }

            resolve(message);
        });
    })
}

contextBridge.exposeInMainWorld("controllers", {
    app: {
        askForFilePath,
        waitForFilePath
    },
    storage: {
        askForFileContent,
        waitForFileContent
    }
});