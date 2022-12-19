// See the Electron documentation for details on how to use preload scripts:
import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import IFilePathPromptRequest from "./models/IFilePathPromptRequest";
import IFilePathPromptResponse from "./models/IFilePathPromptResponse";
import IHomeDirectoryPathResponse from "./models/IHomeDirectoryPathResponse";
import IFileContentRequest from "./models/file/IFIleContentRequest";
import IFileContentResponse from "./models/file/IFileContentResponse";
import IManyFileContentRequest from "./models/file/IManyFileContentRequest";
import IManyFileContentResponse from "./models/file/IManyFileContentResponse";
import IFileCreationRequest from "./models/IFileCreationRequest";
import IFileCreationResponse from "./models/IFileCreationResponse";
import IDirectoryContentRequest from "./models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "./models/directory/IDirectoryContentResponse";
import * as constants from "./constants";

function promptForFilePath(reasonForFile: string): void {
    const request: IFilePathPromptRequest = { reasonForFile };
    ipcRenderer.send(constants.IPC_PROMPT_FILE_PATH_REQUEST, request);
}

async function waitForPromptedForFilePath(): Promise<string> {
    const message = await addIpcListener<IFilePathPromptResponse>(constants.IPC_PROMPT_FILE_PATH_SUCCESS_RESPONSE);
    return message.filePath;
}

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

function askForFileContent(filePath: string): void {
    const request: IFileContentRequest = { filePath };
    ipcRenderer.send(constants.IPC_FILE_CONTENT_REQUEST, request);
}

async function waitForFileContent(): Promise<string> {
    const message = await addIpcListener<IFileContentResponse>(constants.IPC_FILE_CONTENT_SUCCESS_RESPONSE)
    return message.fileContent;
}

function askForManyFileContent(filePaths: string[]): void {
    const fileContentRequests = filePaths.map<IFileContentRequest>(filePath => ({ filePath }));
    const request: IManyFileContentRequest = { fileContentRequests };
    ipcRenderer.send(constants.IPC_MANY_FILE_CONTENT_REQUEST, request);
}

async function waitForManyFileContent(): Promise<string[]> {
    const response = await addIpcListener<IManyFileContentResponse>(constants.IPC_MANY_FILE_CONTENT_SUCCESS_RESPONSE);
    const isSuccessfulFileContentResponse = (response: IFileContentResponse | null) : response is IFileContentResponse => response.success;
    const fileContentResponses = response.fileContentResponses.filter<IFileContentResponse>(isSuccessfulFileContentResponse)
    const toFileContent = (response: IFileContentResponse): string => response.fileContent;
    return fileContentResponses.map<string>(toFileContent);
}

function askForFileCreation(filePath: string, fileContent: string): void {
    const request: IFileCreationRequest = { filePath, fileContent };
    ipcRenderer.send(constants.IPC_FILE_CREATION_REQUEST, request);
}

async function waitForFileCreation(): Promise<void> {
   await addIpcListener<IFileCreationResponse>(constants.IPC_FILE_CREATION_SUCCESS_RESPONSE)
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
        promptForFilePath,
        waitForPromptedForFilePath,
        askForHomeDirectoryPath,
        waitForHomeDirectoryPath,
        askForDirectoryContent,
        waitForDirectoryContent,
        askForFileContent,
        waitForFileContent,
        askForManyFileContent,
        waitForManyFileContent,
        askForFileCreation,
        waitForFileCreation
    }
});