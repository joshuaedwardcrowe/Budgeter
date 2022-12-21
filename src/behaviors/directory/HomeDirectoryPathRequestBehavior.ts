import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import MainIcpModule from "../../modules/MainIcpModule";
import IHomeDirectoryPathResponse from "../../models/directory/IHomeDirectoryPathResponse";
import IpcKey from "../../models/IpcKey";
import { CONFIG_FOLDER_NAME } from "../../constants";

export default function () {
    const operatingSystemHomeDirectoryPath = StorageModule.getOperatingSystemHomeDirectoryPath();
    const homeDirectoryPath = `${operatingSystemHomeDirectoryPath}/${CONFIG_FOLDER_NAME}`;

    const response: IHomeDirectoryPathResponse = {
        success: true,
        homeDirectoryPath
    }

    MainIcpModule.sendSuccess(IpcKey.HOME_DIRECTORY_PATH, response);
    MainLoggingModule.logInfo("HomeDirectoryPathRequestBehavior", `Resolved: ${response.homeDirectoryPath}`);
}