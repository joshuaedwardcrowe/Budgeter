import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/ipc/MainIpcModule";
import IHomeDirectoryPathResponse from "../../models/directory/IHomeDirectoryPathResponse";
import IRequest from "../../models/IRequest";
import IMainBehaviorLoggingModule from "../../modules/logging/IMainBehaviorLoggingModule";

export default async function HomeDirectoryPathRequestConsumer(logging: IMainBehaviorLoggingModule, { source, key }: IRequest) {
    const homeDirectoryPath = StorageModule.getHomeDirectoryPath();

    MainIpcModule.sendSuccess<IHomeDirectoryPathResponse>({
        source,
        key,
        success: true,
        homeDirectoryPath
    });

    logging.logInfo(`Resolved: ${homeDirectoryPath}`);
}