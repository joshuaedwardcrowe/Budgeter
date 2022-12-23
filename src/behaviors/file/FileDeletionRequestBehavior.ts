import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/MainIpcModule";
import IFileDeletionRequest from "../../models/file/IFileDeletionRequest";

export default async function FileDeletionRequestBehavior({ source, key, filePath }: IFileDeletionRequest) {
    const fileExists = await StorageModule.tryCheckFileExists(filePath);
    if (!fileExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false,
        })

        MainLoggingModule.logError(source, FileDeletionRequestBehavior.name, `No File: ${filePath}`);
    }

    try {
        await StorageModule.deleteFile(filePath);

        MainIpcModule.sendSuccess({
            source,
            key,
            success: true
        });

        MainLoggingModule.logInfo(source, FileDeletionRequestBehavior.name, `Deleted File: ${filePath}`);
    } catch (e) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        });

        MainLoggingModule.logError(source, FileDeletionRequestBehavior.name, `Failed to Delete File: ${filePath}`);
    }
}