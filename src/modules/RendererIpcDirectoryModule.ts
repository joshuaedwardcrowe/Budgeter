import RendererIpcModule from "./RendererIpcModule";
import IHomeDirectoryPathResponse from "../models/directory/IHomeDirectoryPathResponse";
import IDirectoryContentRequest from "../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../models/directory/IDirectoryContentResponse";
import Channel from "../models/Channel";

class RendererIpcDirectoryModule extends RendererIpcModule {
    public async prepareForHomeDirectoryPath(): Promise<string> {
        const response = await this.addIpcListeners<IHomeDirectoryPathResponse>(Channel.HOME_DIRECTORY_PATH);
        return response.homeDirectoryPath;
    }

    public askForHomeDirectoryPath(): void {
        this.sendIpcMessage(Channel.HOME_DIRECTORY_PATH);
    }

    public async prepareForDirectoryContent(): Promise<string[]> {
        const response = await this.addIpcListeners<IDirectoryContentResponse>(Channel.DIRECTORY_CONTENT);
        return response.directoryContent;
    }

    public askForDirectoryContent(directoryPath: string): void {
        const request: IDirectoryContentRequest = {
            channel: Channel.DIRECTORY_CONTENT,
            directoryPath
        };

        this.sendIpcMessage(request.channel, request);
    }

}

export default new RendererIpcDirectoryModule();