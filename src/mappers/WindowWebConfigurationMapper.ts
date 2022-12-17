import IBudgeterConfiguration from "../models/IBudgeterConfiguration";
import IWindowWebConfiguration from "../models/IWindowWebConfiguration";

export default class WindowWebConfigurationMapper {
    static fromBudgeterConfiguration(config: IBudgeterConfiguration): IWindowWebConfiguration {
        return {
            nodeIntegration: config.nodeIntegration,
            contextIsolation: config.contextIsolation
        }
    }
}