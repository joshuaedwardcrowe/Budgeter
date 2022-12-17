import IWindowConfiguration from "../models/IWindowConfiguration";
import IWindowWebConfiguration from "../models/IWindowWebConfiguration";
import IBudgeterConfiguration from "../models/IBudgeterConfiguration";

export default class WindowConfigurationMapper {
    static fromBudgeterConfiguration(config: IBudgeterConfiguration, webConfiguration: IWindowWebConfiguration): IWindowConfiguration {
        return {
            title: config.windowTitle,
            indexFile: config.windowIndexFile,
            height: config.windowHeight,
            width: config.windowWidth,
            webPreferences: webConfiguration
        }
    }
}