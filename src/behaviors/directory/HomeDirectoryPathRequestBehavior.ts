import MainLoggingModule from "../../modules/MainLoggingModule";
import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/MainIpcModule";
import IHomeDirectoryPathResponse from "../../models/directory/IHomeDirectoryPathResponse";
import IRequest from "../../models/IRequest";

export default function ({ source, key }: IRequest) {
    const homeDirectoryPath = StorageModule.getHomeDirectoryPath();

    MainIpcModule.sendSuccess<IHomeDirectoryPathResponse>({
        source,
        key,
        success: true,
        homeDirectoryPath
    });

    MainLoggingModule.logInfo(source, "HomeDirectoryPathRequestBehavior", `Resolved: ${homeDirectoryPath}`);
}