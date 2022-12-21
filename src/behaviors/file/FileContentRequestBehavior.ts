import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IFileContentRequest from "../../models/file/IFIleContentRequest";
import IFileContentResponse from "../../models/file/IFileContentResponse";
import Channel from "../../models/Channel";

function sendContentFailureResponse() {
    const response: IFileContentResponse = {
        success: false,
        fileContent: null
    }

    WindowModule.sendFailure(Channel.FILE_CONTENT, response)
}

export default async function (request: IFileContentRequest) {
    const fileExists = StorageModule.tryCheckFileExists(request.filePath);

    if (!fileExists) {
        MainLoggingModule.logWarning("DirectoryContentRequestBehavior", `No File: ${request.filePath}`);
        sendContentFailureResponse();
        return;
    }

    try {
        const fileContent = await StorageModule.readFile(request.filePath);

        const message: IFileContentResponse = {
            success: true,
            fileContent
        };

        WindowModule.sendSuccess(Channel.FILE_CONTENT, message);
    } catch (e) {
        MainLoggingModule.logWarning("DirectoryContentRequestBehavior", `No File Content: ${request.filePath}`);
        sendContentFailureResponse();
    }
}