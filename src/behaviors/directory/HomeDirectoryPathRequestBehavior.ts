import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import WindowModule from "../../modules/WindowModule";
import IHomeDirectoryPathResponse from "../../models/directory/IHomeDirectoryPathResponse";
import Channel from "../../models/Channel";
import { CONFIG_FOLDER_NAME } from "../../constants";

export default function () {
    const operatingSystemHomeDirectoryPath = StorageModule.getOperatingSystemHomeDirectoryPath();
    const homeDirectoryPath = `${operatingSystemHomeDirectoryPath}/${CONFIG_FOLDER_NAME}`;

    const response: IHomeDirectoryPathResponse = {
        success: true,
        homeDirectoryPath
    }

    WindowModule.sendSuccess(Channel.HOME_DIRECTORY_PATH, response);
    MainLoggingModule.logInfo("HomeDirectoryPathRequestBehavior", `Resolved: ${response.homeDirectoryPath}`);
}