import WindowModule from "../../modules/WindowModule";
import MainLoggingModule from "../../modules/MainLoggingModule";
import ConfigurationModule from "../../modules/ConfigurationModule";
import IBudgeterConfiguration from "../../models/IBudgeterConfiguration";
import WindowConfigurationMapper from "../../mappers/WindowConfigurationMapper";
import WindowWebConfigurationMapper from "../../mappers/WindowWebConfigurationMapper";
import * as constants from "../../constants";

export default async function (load: string, preload: string) {
    try {
        const budgeterConfiguration: IBudgeterConfiguration = await ConfigurationModule.getConfiguration();
        MainLoggingModule.logInfo("AppReadyBehavior", "Successfully Got Config");

        const windowWebConfiguration = WindowWebConfigurationMapper.fromBudgeterConfiguration(budgeterConfiguration);
        windowWebConfiguration.preload = preload;

        const windowConfiguration = WindowConfigurationMapper.fromBudgeterConfiguration(budgeterConfiguration, windowWebConfiguration);

        const window = await WindowModule.createWindow(windowConfiguration);
        MainLoggingModule.logInfo("AppReadyBehavior", `Created Window: ${window.title}`);

        await window.loadURL(load);
        MainLoggingModule.logInfo("AppReadyBehavior", `Loaded URL: ${load}`);

        window.webContents.openDevTools();
        MainLoggingModule.logInfo("AppReadyBehavior", "Opened Window Developer Tools");
    } catch (e) {
        MainLoggingModule.logError("AppReadyBehavior", "Failed to Create Window");
        WindowModule.showErrorDialog(constants.FAILED_CONFIG_ERROR_TITLE, constants.FAILED_CONFIG_ERROR_MESSAGE)
    }
}