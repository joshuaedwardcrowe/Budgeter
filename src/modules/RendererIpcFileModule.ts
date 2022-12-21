import RendererIpcModule from "./RendererIpcModule";
import IFilePathPromptRequest from "../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../models/file/IFilePathPromptResponse";
import IFileContentRequest from "../models/file/IFIleContentRequest";
import IFileContentResponse from "../models/file/IFileContentResponse";
import IFileCreationRequest from "../models/file/IFileCreationRequest";
import IResponse from "../models/IResponse";
import IpcChannel from "../models/IpcChannel";

class RendererIpcFileModule extends RendererIpcModule {
    public async resolvePromptedForFilePath(): Promise<string> {
        const response = await this.addIpcListeners<IFilePathPromptResponse>(IpcChannel.PROMPT_FILE_PATH);
        return response.filePath;
    }

    public askToPromptForFilePath(reasonForFilePath: string): void {
        const request: IFilePathPromptRequest = {
            channel: IpcChannel.PROMPT_FILE_PATH,
            reasonForFilePath
        }

        this.sendIpcMessage(request.channel, request);
    }

    public async resolveFileContent(): Promise<string> {
        const response = await this.addIpcListeners<IFileContentResponse>(IpcChannel.FILE_CONTENT);
        return response.fileContent;
    }

    public askForFileContent(filePath: string) {
        const request: IFileContentRequest = {
            channel: IpcChannel.FILE_CONTENT,
            filePath
        };

        this.sendIpcMessage(request.channel, request);
    }

    public async waitForFileCreation(): Promise<void> {
        await this.addIpcListeners<IResponse>(IpcChannel.FILE_CREATION);
    }

    public askForFileCreation(filePath: string, fileContent: string) {
        const request: IFileCreationRequest = {
            channel: IpcChannel.FILE_CREATION,
            filePath,
            fileContent
        }

        this.sendIpcMessage(request.channel, request);
    }
}

export default new RendererIpcFileModule();