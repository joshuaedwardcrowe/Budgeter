import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import MainIcpModule from "../../modules/MainIcpModule";
import IFileDeletionRequest from "../../models/file/IFileDeletionRequest";
import IpcKey from "../../models/IpcKey";

export default async function (request: IFileDeletionRequest) {
    const fileExists = await StorageModule.tryCheckFileExists(request.filePath);
    if (!fileExists) {
        MainLoggingModule.logError("FileDeletioNRequestBehavior", `No File: ${request.filePath}`);
        MainIcpModule.sendSuccess(IpcKey.FILE_DELETION);
    }

    try {
        await StorageModule.deleteFile(request.filePath);
        MainIcpModule.sendSuccess(IpcKey.FILE_DELETION);
        MainLoggingModule.logInfo("FileDeletionRequestBehavior", `Deleted File: ${request.filePath}`);
    } catch (e) {
        MainIcpModule.sendFailure(IpcKey.FILE_DELETION);
        MainLoggingModule.logError("FileDeletionRequestBehavior", `Failed to Delete File: ${request.filePath}`);
    }
}