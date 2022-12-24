import IWindowConfiguration from "../models/window/IWindowConfiguration";
import IBudgeterConfiguration from "../models/IBudgeterConfiguration";

export default class WindowConfigurationMapper {
    static fromBudgeterConfiguration(config: IBudgeterConfiguration): IWindowConfiguration {
        return {
            title: config.windowTitle,
            height: config.windowHeight,
            width: config.windowWidth
        }
    }
}