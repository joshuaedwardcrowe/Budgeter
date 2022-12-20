import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IHomeDirectoryPathResponse from "../../models/directory/IHomeDirectoryPathResponse";
import * as constants from "../../constants";

export default function () {
    const response: IHomeDirectoryPathResponse = {
        success: true,
        homeDirectoryPath: StorageModule.getHomeDirectoryPath()
    }

    WindowModule.send(constants.IPC_HOME_DIRECTORY_PATH_SUCCESS_RESPONSE, response);
    MainLoggingModule.logInfo("HomeDirectoryPathRequestBehavior", `Resolved: ${response.homeDirectoryPath}`);
}