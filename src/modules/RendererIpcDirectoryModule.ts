import RendererIpcModule from "./RendererIpcModule";
import IHomeDirectoryPathResponse from "../models/directory/IHomeDirectoryPathResponse";
import IDirectoryContentRequest from "../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../models/directory/IDirectoryContentResponse";
import IpcKey from "../models/IpcKey";

class RendererIpcDirectoryModule extends RendererIpcModule {
    public async resolveHomeDirectoryPath(): Promise<string> {
        const response = await this.addIpcListeners<IHomeDirectoryPathResponse>(IpcKey.HOME_DIRECTORY_PATH);
        return response.homeDirectoryPath;
    }

    public askForHomeDirectoryPath(): void {
        this.sendIpcMessage(IpcKey.HOME_DIRECTORY_PATH);
    }

    public async resolveDirectoryContent(): Promise<string[]> {
        const response = await this.addIpcListeners<IDirectoryContentResponse>(IpcKey.DIRECTORY_CONTENT);
        return response.directoryContent;
    }

    public askForDirectoryContent(directoryPath: string): void {
        const request: IDirectoryContentRequest = {
            key: IpcKey.DIRECTORY_CONTENT,
            directoryPath
        };

        this.sendIpcMessage(request.key, request);
    }

}

export default new RendererIpcDirectoryModule();