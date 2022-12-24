import RendererIpcModule from "./RendererIpcModule";
import IFilePathPromptRequest from "../../models/file/IFilePathPromptRequest";
import IFilePathPromptResponse from "../../models/file/IFilePathPromptResponse";
import IFileContentRequest from "../../models/file/IFIleContentRequest";
import IFileContentResponse from "../../models/file/IFileContentResponse";
import IFileCreationRequest from "../../models/file/IFileCreationRequest";
import IResponse from "../../models/IResponse";
import IpcKey from "../../models/IpcKey";
import IpcSource from "../../models/IpcSource";
import IFileDeletionRequest from "../../models/file/IFileDeletionRequest";

class RendererIpcFileModule extends RendererIpcModule {
    public async resolvePromptedForFilePath(): Promise<string> {
        const response = await this.addIpcListeners<IFilePathPromptResponse>(IpcKey.PROMPT_FILE_PATH);
        return response.filePath;
    }

    public askToPromptForFilePath(source: IpcSource, directoryPath: string, reasonForFilePath: string): void {
        this.sendIpcMessage<IFilePathPromptRequest>({
            source,
            key: IpcKey.PROMPT_FILE_PATH,
            directoryPath,
            reasonForFilePath
        });
    }

    public async resolveFileContent(): Promise<string> {
        const response = await this.addIpcListeners<IFileContentResponse>(IpcKey.FILE_CONTENT);
        return response.fileContent;
    }

    public askForFileContent(source: IpcSource, filePath: string) {
        this.sendIpcMessage<IFileContentRequest>({
            source,
            key: IpcKey.FILE_CONTENT,
            filePath
        });
    }

    public async waitForFileCreation(): Promise<void> {
        await this.addIpcListeners<IResponse>(IpcKey.FILE_CREATION);
    }

    public askForFileCreation(source: IpcSource, filePath: string, fileContent: string) {
        this.sendIpcMessage<IFileCreationRequest>({
            source,
            key: IpcKey.FILE_CREATION,
            filePath,
            fileContent
        })
    }

    public async waitForFileDeletion(): Promise<void> {
        await this.addIpcListeners<IResponse>(IpcKey.FILE_DELETION);
    }

    public askForFileDeletion(source: IpcSource, filePath: string) {
        this.sendIpcMessage<IFileDeletionRequest>({
            source,
            key: IpcKey.FILE_DELETION,
            filePath
        });
    }
}

export default new RendererIpcFileModule();