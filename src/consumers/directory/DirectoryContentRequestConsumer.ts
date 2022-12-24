import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/MainIpcModule";
import IDirectoryContentRequest from "../../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../../models/directory/IDirectoryContentResponse";
import IMainBehaviorLoggingModule from "../../modules/logging/IMainBehaviorLoggingModule";

export default async function DirectoryContentRequestConsumer(logging: IMainBehaviorLoggingModule, { source, key, directoryPath }: IDirectoryContentRequest) {
    const directoryExists = await StorageModule.tryCheckDirectoryExists(directoryPath);

    if (!directoryExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        logging.logWarning(`No Directory: ${directoryPath}`);

        return;
    }

    try {
        const directoryContent = await StorageModule.readDirectoryContent(directoryPath);

        MainIpcModule.sendSuccess<IDirectoryContentResponse>({
            source,
            key,
            success: true,
            directoryContent
        })

        logging.logInfo(`Resolved: ${directoryContent}`);
    } catch (e) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        logging.logWarning(`Failed Read Directory Content: ${directoryPath}`);
    }
}
