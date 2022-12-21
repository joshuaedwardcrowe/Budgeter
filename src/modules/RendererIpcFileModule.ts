import RendererIpcModule from "./RendererIpcModule";
import IFilePathPromptRequest from "../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../models/file/IFilePathPromptResponse";
import IFileContentRequest from "../models/file/IFIleContentRequest";
import IFileContentResponse from "../models/file/IFileContentResponse";
import IFileCreationRequest from "../models/file/IFileCreationRequest";
import IResponse from "../models/IResponse";
import Channel from "../models/Channel";

class RendererIpcFileModule extends RendererIpcModule {
    public async prepareForPromptedFilePath(): Promise<string> {
        const response = await this.addIpcListeners<IFilePathPromptResponse>(Channel.PROMPT_FILE_PATH);
        return response.filePath;
    }

    public askToPromptForFilePath(reasonForFilePath: string): void {
        const request: IFilePathPromptRequest = {
            channel: Channel.PROMPT_FILE_PATH,
            reasonForFilePath
        }

        this.sendIpcMessage(request.channel, request);
    }

    public async prepareForFileContent(): Promise<string> {
        const response = await this.addIpcListeners<IFileContentResponse>(Channel.FILE_CONTENT);
        return response.fileContent;
    }

    public askForFileContent(filePath: string) {
        const request: IFileContentRequest = {
            channel: Channel.FILE_CONTENT,
            filePath
        };

        this.sendIpcMessage(request.channel, request);
    }

    public async prepareForFileCreation(): Promise<void> {
        await this.addIpcListeners<IResponse>(Channel.FILE_CREATION);
    }

    public askForFileCreation(filePath: string, fileContent: string) {
        const request: IFileCreationRequest = {
            channel: Channel.FILE_CREATION,
            filePath,
            fileContent
        }

        this.sendIpcMessage(request.channel, request);
    }
}

export default new RendererIpcFileModule();