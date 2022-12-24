import StorageModule from "../../modules/StorageModule";
import MainIpcModule from "../../modules/ipc/MainIpcModule";
import IHomeDirectoryPathResponse from "../../models/directory/IHomeDirectoryPathResponse";
import IRequest from "../../models/IRequest";
import MainConsumerLoggingModule from "../../modules/logging/MainConsumerLoggingModule";

export default async function HomeDirectoryPathRequestConsumer(logging: MainConsumerLoggingModule, { source, key }: IRequest) {
    const homeDirectoryPath = StorageModule.getHomeDirectoryPath();

    MainIpcModule.sendSuccess<IHomeDirectoryPathResponse>({
        source,
        key,
        success: true,
        homeDirectoryPath
    });

    logging.logInfo(`Resolved: ${homeDirectoryPath}`);
}