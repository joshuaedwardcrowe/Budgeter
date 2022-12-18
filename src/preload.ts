// See the Electron documentation for details on how to use preload scripts:
import { ipcRenderer, contextBridge } from "electron";
import * as constants from "./constants";
import IpcRendererEvent = Electron.IpcRendererEvent;
import IFilePathRequest from "./models/IFilePathRequest";
import IFilePathResponse from "./models/IFilePathResponse";


function askForFilePath(reasonForFile: string): void {
    const request: IFilePathRequest = { reasonForFile };
    ipcRenderer.send(constants.IPC_FILE_PATH_REQUEST, request);
}

async function waitForFilePath(): Promise<string> {
    const message = await addIpcListener<IFilePathResponse>(constants.IPC_FILE_PATH_LOCATED);
    return message.filePath;
}

async function addIpcListener<TMessage>(channel: string): Promise<TMessage> {
    return new Promise((resolve, reject) => {
        console.log(`SETTING UP: ${constants.IPC_FILE_PATH_LOCATED}`);
        ipcRenderer.on(channel, (event: IpcRendererEvent, message: TMessage) => {
            console.log(`RECEIVED: ${constants.IPC_FILE_PATH_LOCATED}`);
            console.log("ARGSSSSS");
            console.log(message);
            if (!message) {
                reject();
            }

            resolve(message);
        });
    })
}



contextBridge.exposeInMainWorld("controllers", {
    storage: {
        askForFilePath,
        waitForFilePath
    }
});