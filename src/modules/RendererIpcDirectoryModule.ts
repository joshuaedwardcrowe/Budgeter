import RendererIpcModule from "./RendererIpcModule";
import IHomeDirectoryPathResponse from "../models/directory/IHomeDirectoryPathResponse";
import IDirectoryContentRequest from "../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../models/directory/IDirectoryContentResponse";
import IpcKey from "../models/IpcKey";
import IRequest from "../models/IRequest";
import IpcSource from "../models/IpcSource";

class RendererIpcDirectoryModule extends RendererIpcModule {
    public async resolveHomeDirectoryPath(): Promise<string> {
        const { homeDirectoryPath } = await this.addIpcListeners<IHomeDirectoryPathResponse>(IpcKey.HOME_DIRECTORY_PATH);
        return homeDirectoryPath;
    }

    public askForHomeDirectoryPath(source: IpcSource): void {
        this.sendIpcMessage<IRequest>({
            source,
            key: IpcKey.HOME_DIRECTORY_PATH
        });
    }

    public async resolveDirectoryContent(): Promise<string[]> {
        const { directoryContent } = await this.addIpcListeners<IDirectoryContentResponse>(IpcKey.DIRECTORY_CONTENT);
        return directoryContent;
    }

    public askForDirectoryContent(source: IpcSource, directoryPath: string): void {
        this.sendIpcMessage<IDirectoryContentRequest>({
            source,
            key: IpcKey.DIRECTORY_CONTENT,
            directoryPath
        });
    }

}

export default new RendererIpcDirectoryModule();