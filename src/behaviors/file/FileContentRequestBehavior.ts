import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/MainIpcModule";
import IFileContentRequest from "../../models/file/IFIleContentRequest";
import IFileContentResponse from "../../models/file/IFileContentResponse";

export default async function FileContentRequestBehavior({ source, key, filePath }: IFileContentRequest) {
    const fileExists = await StorageModule.tryCheckFileExists(filePath);

    if (!fileExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        // TODO: A nicer way to build the logger for this behavior?
        MainLoggingModule.logWarning(source, FileContentRequestBehavior.name, `No File: ${filePath}`);
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

        MainLoggingModule.logInfo(source, FileContentRequestBehavior.name, `File Found: ${filePath}`);
    } catch (e) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        MainLoggingModule.logWarning(source, FileContentRequestBehavior.name, `No File Content: ${filePath} [${source}]`);
    }
}