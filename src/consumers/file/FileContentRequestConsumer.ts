import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/ipc/MainIpcModule";
import IFileContentRequest from "../../models/file/IFIleContentRequest";
import IFileContentResponse from "../../models/file/IFileContentResponse";
import MainConsumerLoggingModule from "../../modules/logging/MainConsumerLoggingModule";

export default async function FileContentRequestConsumer(logger: MainConsumerLoggingModule, { source, key, filePath }: IFileContentRequest) {
    const fileExists = await StorageModule.tryCheckFileExists(filePath);

    if (!fileExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        // TODO: A nicer way to build the logger for this behavior?
        logger.logWarning(`No File: ${filePath}`);
        return;
    }

    try {
        const fileContent = await StorageModule.readFile(filePath);

        MainIpcModule.sendSuccess<IFileContentResponse>({
            source,
            key,
            success: true,
            fileContent
        })

        logger.logInfo(`File Found: ${filePath}`);
    } catch (e) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        logger.logWarning(`No File Content: ${filePath} [${source}]`);
    }
}