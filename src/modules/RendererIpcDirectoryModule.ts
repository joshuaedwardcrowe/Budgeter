import RendererIpcModule from "./RendererIpcModule";
import IHomeDirectoryPathResponse from "../models/directory/IHomeDirectoryPathResponse";
import IDirectoryContentRequest from "../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../models/directory/IDirectoryContentResponse";
import IpcChannel from "../models/IpcChannel";

class RendererIpcDirectoryModule extends RendererIpcModule {
    public async resolveHomeDirectoryPath(): Promise<string> {
        const response = await this.addIpcListeners<IHomeDirectoryPathResponse>(IpcChannel.HOME_DIRECTORY_PATH);
        return response.homeDirectoryPath;
    }

    public askForHomeDirectoryPath(): void {
        this.sendIpcMessage(IpcChannel.HOME_DIRECTORY_PATH);
    }

    public async resolveDirectoryContent(): Promise<string[]> {
        const response = await this.addIpcListeners<IDirectoryContentResponse>(IpcChannel.DIRECTORY_CONTENT);
        return response.directoryContent;
    }

    public askForDirectoryContent(directoryPath: string): void {
        const request: IDirectoryContentRequest = {
            channel: IpcChannel.DIRECTORY_CONTENT,
            directoryPath
        };

        this.sendIpcMessage(request.channel, request);
    }

}

export default new RendererIpcDirectoryModule();