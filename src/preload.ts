import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import IHomeDirectoryPathResponse from "./models/directory/IHomeDirectoryPathResponse";
import IDirectoryContentRequest from "./models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "./models/directory/IDirectoryContentResponse";
import * as constants from "./constants";
import RendererFileModule from "./modules/RendererFileModule";

// TODO: Handle error responses with Promise.race?

function askForHomeDirectoryPath(): void {
    ipcRenderer.send(constants.IPC_HOME_DIRECTORY_PATH_REQUEST);
}

async function waitForHomeDirectoryPath(): Promise<string> {
    const message = await addIpcListener<IHomeDirectoryPathResponse>(constants.IPC_HOME_DIRECTORY_PATH_SUCCESS_RESPONSE);
    return message.homeDirectoryPath;
}

function askForDirectoryContent(directoryPath: string): void {
    const request: IDirectoryContentRequest = { directoryPath };
    ipcRenderer.send(constants.IPC_DIRECTORY_CONTENT_REQUEST, request);
}

async function waitForDirectoryContent(): Promise<string[]> {
    const response = await addIpcListener<IDirectoryContentResponse>(constants.IPC_DIRECTORY_CONTENT_SUCCESS_RESPONSE);
    return response.directoryContent;
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
    storage: {
        promptForFilePath: RendererFileModule.askToPromptForFilePath.bind(RendererFileModule),
        waitForPromptedForFilePath: RendererFileModule.prepareForPromptedFilePath.bind(RendererFileModule),
        askForHomeDirectoryPath,
        waitForHomeDirectoryPath,
        askForDirectoryContent,
        waitForDirectoryContent,
        askForFileContent: RendererFileModule.askForFileContent.bind(RendererFileModule),
        waitForFileContent: RendererFileModule.prepareForFileContent.bind(RendererFileModule),
        askForFileCreation: RendererFileModule.askForFileCreation.bind(RendererFileModule),
        waitForFileCreation: RendererFileModule.prepareForFileCreation.bind(RendererFileModule)
    }
});