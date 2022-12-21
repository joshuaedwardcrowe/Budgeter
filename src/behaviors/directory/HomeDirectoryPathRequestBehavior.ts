import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IHomeDirectoryPathResponse from "../../models/directory/IHomeDirectoryPathResponse";
import Channel from "../../models/Channel";

export default function () {
    const response: IHomeDirectoryPathResponse = {
        success: true,
        homeDirectoryPath: StorageModule.getHomeDirectoryPath()
    }

    WindowModule.sendSuccess(Channel.HOME_DIRECTORY_PATH, response);
    MainLoggingModule.logInfo("HomeDirectoryPathRequestBehavior", `Resolved: ${response.homeDirectoryPath}`);
}