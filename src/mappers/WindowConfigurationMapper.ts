import IWindowConfiguration from "../models/window/IWindowConfiguration";
import IWindowWebConfiguration from "../models/window/IWindowWebConfiguration";
import IBudgeterConfiguration from "../models/IBudgeterConfiguration";

export default class WindowConfigurationMapper {
    static fromBudgeterConfiguration(config: IBudgeterConfiguration, webConfiguration: IWindowWebConfiguration): IWindowConfiguration {
        return {
            title: config.windowTitle,
            height: config.windowHeight,
            width: config.windowWidth,
            webPreferences: webConfiguration
        }
    }
}