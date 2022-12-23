import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/MainIpcModule";
import IFileCreationRequest from "../../models/file/IFileCreationRequest";

export default async function FileCreationRequestBehavior({ source, key, filePath, fileContent }: IFileCreationRequest) {
    MainLoggingModule.logInfo(source, FileCreationRequestBehavior.name, `Got Request`);

    const fileExists = await StorageModule.tryCheckFileExists(filePath);

    if (fileExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        MainLoggingModule.logWarning(source, FileCreationRequestBehavior.name, `File Exists: ${filePath}`);

        return;
    }

    try {
        await StorageModule.createFile(filePath, fileContent);

        MainIpcModule.sendSuccess({
            source,
            key,
            success: true
        });

        MainLoggingModule.logInfo(source, FileCreationRequestBehavior.name,`Resolved: ${filePath}`);
    } catch (e) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        MainLoggingModule.logWarning(source, FileCreationRequestBehavior.name, `Could Not Create File: ${filePath}`);
    }
}