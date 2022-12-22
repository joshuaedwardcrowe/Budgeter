import RendererIpcModule from "./RendererIpcModule";
import IFilePathPromptRequest from "../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../models/file/IFilePathPromptResponse";
import IFileContentRequest from "../models/file/IFIleContentRequest";
import IFileContentResponse from "../models/file/IFileContentResponse";
import IFileCreationRequest from "../models/file/IFileCreationRequest";
import IResponse from "../models/IResponse";
import IpcKey from "../models/IpcKey";
import IFileDeletionRequest from "../models/file/IFileDeletionRequest";

class RendererIpcFileModule extends RendererIpcModule {
    public async resolvePromptedForFilePath(): Promise<string> {
        const response = await this.addIpcListeners<IFilePathPromptResponse>(IpcKey.PROMPT_FILE_PATH);
        return response.filePath;
    }

    public askToPromptForFilePath(reasonForFilePath: string): void {
        const request: IFilePathPromptRequest = {
            key: IpcKey.PROMPT_FILE_PATH,
            reasonForFilePath
        }

        this.sendIpcMessage(request.key, request);
    }

    public async resolveFileContent(): Promise<string> {
        const response = await this.addIpcListeners<IFileContentResponse>(IpcKey.FILE_CONTENT);
        return response.fileContent;
    }

    public askForFileContent(filePath: string) {
        const request: IFileContentRequest = {
            key: IpcKey.FILE_CONTENT,
            filePath
        };

        this.sendIpcMessage(request.key, request);
    }

    public async waitForFileCreation(): Promise<void> {
        await this.addIpcListeners<IResponse>(IpcKey.FILE_CREATION);
    }

    public askForFileCreation(filePath: string, fileContent: string) {
        const request: IFileCreationRequest = {
            key: IpcKey.FILE_CREATION,
            filePath,
            fileContent
        }

        this.sendIpcMessage(request.key, request);
    }

    public async waitForFileDeletion(): Promise<void> {
        await this.addIpcListeners<IResponse>(IpcKey.FILE_DELETION);
    }

    public askForFileDeletion(filePath: string) {
        const request: IFileDeletionRequest = {
            key: IpcKey.FILE_DELETION,
            filePath
        };

        this.sendIpcMessage(request.key, request);
    }
}

export default new RendererIpcFileModule();