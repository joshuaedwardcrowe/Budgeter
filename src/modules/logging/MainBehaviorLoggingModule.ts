import IpcSource from "../../models/IpcSource";
import IpcKey from "../../models/IpcKey";
import IMainBehaviorLoggingModule from "./IMainBehaviorLoggingModule";
import MainLoggingModule from "./MainLoggingModule";

export default class MainBehaviorLoggingModule implements IMainBehaviorLoggingModule {
    private readonly source: IpcSource;
    private readonly key: IpcKey;
    private readonly locationName: string;

    constructor(source: IpcSource, key: IpcKey, locationName: string) {
        this.source = source;
        this.key = key;
        this.locationName = locationName;
    }

    logInfo(message: string) {
        MainLoggingModule.logInfo(this.getSource(), this.locationName, message);
    }

    logWarning(message: string) {
        MainLoggingModule.logWarning(this.getSource(), this.locationName, message);
    }

    public logError(message: string) {
        MainLoggingModule.logError(this.getSource(), this.locationName, message);
    }

    private getSource() {
        return `${IpcSource.Main} for ${this.source}`;
    }
}