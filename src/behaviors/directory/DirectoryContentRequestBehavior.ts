import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/MainIpcModule";
import IDirectoryContentRequest from "../../models/directory/IDirectoryContentRequest";
import IDirectoryContentResponse from "../../models/directory/IDirectoryContentResponse";

export default async function ({ source, key, directoryPath }: IDirectoryContentRequest) {
    const directoryExists = await StorageModule.tryCheckDirectoryExists(directoryPath);

    if (!directoryExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        MainLoggingModule.logWarning(source, "DirectoryContentRequestBehavior", `No Directory: ${directoryPath}`);

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

        MainLoggingModule.logInfo(source,"DirectoryContentRequestBehavior", `Resolved: ${directoryContent}`);
    } catch (e) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        MainLoggingModule.logWarning(source, "DirectoryContentRequestBehavior", `Failed Read Directory Content: ${directoryPath}`);
    }
}
