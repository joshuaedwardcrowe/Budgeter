import RendererIpcModule from "./RendererIpcModule";
import IFilePathPromptRequest from "../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../models/file/IFilePathPromptResponse";
import IFileContentRequest from "../models/file/IFIleContentRequest";
import IFileContentResponse from "../models/file/IFileContentResponse";
import IFileCreationRequest from "../models/file/IFileCreationRequest";
import IResponse from "../models/IResponse";
import IpcKey from "../models/IpcKey";

class RendererIpcFileModule extends RendererIpcModule {
    public async resolvePromptedForFilePath(): Promise<string> {
        const response = await this.addIpcListeners<IFilePathPromptResponse>(IpcKey.PROMPT_FILE_PATH);
        return response.filePath;
    }

    public askToPromptForFilePath(reasonForFilePath: string): void {
        const request: IFilePathPromptRequest = {
            channel: IpcKey.PROMPT_FILE_PATH,
            reasonForFilePath
        }

        this.sendIpcMessage(request.channel, request);
    }

    public async resolveFileContent(): Promise<string> {
        const response = await this.addIpcListeners<IFileContentResponse>(IpcKey.FILE_CONTENT);
        return response.fileContent;
    }

    public askForFileContent(filePath: string) {
        const request: IFileContentRequest = {
            channel: IpcKey.FILE_CONTENT,
            filePath
        };

        this.sendIpcMessage(request.channel, request);
    }

    public async waitForFileCreation(): Promise<void> {
        await this.addIpcListeners<IResponse>(IpcKey.FILE_CREATION);
    }

    public askForFileCreation(filePath: string, fileContent: string) {
        const request: IFileCreationRequest = {
            channel: IpcKey.FILE_CREATION,
            filePath,
            fileContent
        }

        this.sendIpcMessage(request.channel, request);
    }
}

export default new RendererIpcFileModule();