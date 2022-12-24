import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/ipc/MainIpcModule";
import IFileCreationRequest from "../../models/file/IFileCreationRequest";
import IMainBehaviorLoggingModule from "../../modules/logging/IMainBehaviorLoggingModule";

export default async function FileCreationRequestConsumer(logger: IMainBehaviorLoggingModule, { source, key, filePath, fileContent }: IFileCreationRequest) {
    logger.logInfo(`Got Request`);

    const fileExists = await StorageModule.tryCheckFileExists(filePath);

    if (fileExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        logger.logWarning(`File Exists: ${filePath}`);

        return;
    }

    try {
        await StorageModule.createFile(filePath, fileContent);

        MainIpcModule.sendSuccess({
            source,
            key,
            success: true
        });

        logger.logInfo(`Resolved: ${filePath}`);
    } catch (e) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        logger.logWarning(`Could Not Create File: ${filePath}`);
    }
}