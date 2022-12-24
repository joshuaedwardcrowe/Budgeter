import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/ipc/MainIpcModule";
import IFileDeletionRequest from "../../models/file/IFileDeletionRequest";
import MainConsumerLoggingModule from "../../modules/logging/MainConsumerLoggingModule";

export default async function FileDeletionRequestConsumer(logger: MainConsumerLoggingModule, { source, key, filePath }: IFileDeletionRequest) {
    const fileExists = await StorageModule.tryCheckFileExists(filePath);
    if (!fileExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false,
        })

        logger.logError(`No File: ${filePath}`);
    }

    try {
        await StorageModule.deleteFile(filePath);

        MainIpcModule.sendSuccess({
            source,
            key,
            success: true
        });

        logger.logInfo(`Deleted File: ${filePath}`);
    } catch (e) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        });

        logger.logError(`Failed to Delete File: ${filePath}`);
    }
}