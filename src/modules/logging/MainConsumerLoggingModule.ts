import IpcSource from "../../models/IpcSource";
import IpcKey from "../../models/IpcKey";
import MainLoggingModule from "./MainLoggingModule";

export default class MainConsumerLoggingModule {
    private readonly source: IpcSource;
    private readonly key: IpcKey;
    private readonly locationName: string;

    constructor(source: IpcSource, key: IpcKey, locationName: string) {
        this.source = source;
        this.key = key;
        this.locationName = locationName;
    }

    public logDebug(message: string): void {
        MainLoggingModule.logDebug(this.getSource(), this.locationName, message);
    }

    public logInfo(message: string): void {
        MainLoggingModule.logInfo(this.getSource(), this.locationName, message);
    }

    public logWarning(message: string): void {
        MainLoggingModule.logWarning(this.getSource(), this.locationName, message);
    }

    public logError(message: string): void {
        MainLoggingModule.logError(this.getSource(), this.locationName, message);
    }

    private getSource(): string {
        return `${IpcSource.Main} for ${this.source}`;
    }
}