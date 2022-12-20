import WindowModule from "../../modules/WindowModule";
import MainLoggingModule from "../../modules/MainLoggingModule";
import MainLoggingLevel from "../../models/MainLoggingLevel";
import ConfigurationModule from "../../modules/ConfigurationModule";
import IBudgeterConfiguration from "../../models/IBudgeterConfiguration";
import WindowConfigurationMapper from "../../mappers/WindowConfigurationMapper";
import WindowWebConfigurationMapper from "../../mappers/WindowWebConfigurationMapper";
import * as constants from "../../constants";

async function getConfiguration(): Promise<IBudgeterConfiguration> {
    try {
        MainLoggingModule.log(MainLoggingLevel.INFO, "AppReadyBehavior.getConfiguration", "Attempting to Get Config");
        return await ConfigurationModule.getConfiguration();
    } catch (e: unknown) {
        MainLoggingModule.log(MainLoggingLevel.ERROR, "AppReadyBehavior.getConfiguration", "Failed to Get Config");
        WindowModule.showErrorDialog(
                constants.FAILED_CONFIG_ERROR_TITLE,
                constants.FAILED_CONFIG_ERROR_MESSAGE
        )
    }
}

export default async function (load: string, preload: string) {
    const budgeterConfiguration = await getConfiguration();
    MainLoggingModule.log(MainLoggingLevel.INFO, "AppReadyBehavior", "Successfully Got Config");

    const windowWebConfiguration = WindowWebConfigurationMapper.fromBudgeterConfiguration(budgeterConfiguration);
    windowWebConfiguration.preload = preload;

    const windowConfiguration = WindowConfigurationMapper.fromBudgeterConfiguration(budgeterConfiguration, windowWebConfiguration);

    const window = await WindowModule.createWindow(windowConfiguration);
    MainLoggingModule.log(MainLoggingLevel.INFO, "AppReadyBehavior", `Created Window: ${window.title}`);

    await window.loadURL(load);
    MainLoggingModule.log(MainLoggingLevel.INFO, "AppReadyBehavior", `Loaded URL: ${load}`);

    window.webContents.openDevTools();
    MainLoggingModule.log(MainLoggingLevel.INFO, "AppReadyBehavior", "Opened Window Developer Tools");
}