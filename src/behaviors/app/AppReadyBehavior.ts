import WindowModule from "../../modules/WindowModule";
import MainLoggingModule from "../../modules/logging/MainLoggingModule";
import ConfigurationModule from "../../modules/ConfigurationModule";
import IBudgeterConfiguration from "../../models/IBudgeterConfiguration";
import WindowConfigurationMapper from "../../mappers/WindowConfigurationMapper";
import WindowWebConfigurationMapper from "../../mappers/WindowWebConfigurationMapper";
import IpcSource from "../../models/IpcSource";
import * as constants from "../../constants";
import IWindowWebConfiguration from "../../models/window/IWindowWebConfiguration";
import IWindowConfiguration from "../../models/window/IWindowConfiguration";

export default async function AppReadyBehavior(load: string, preload: string) {
    try {
        const configuration: IBudgeterConfiguration = await ConfigurationModule.getConfiguration();
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, "Successfully Got Config");

        const windowWebConfiguration: IWindowWebConfiguration = WindowWebConfigurationMapper.fromBudgeterConfiguration(configuration);
        windowWebConfiguration.preload = preload;
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, `Created Window Web Configuration`);

        const windowConfiguration: IWindowConfiguration = WindowConfigurationMapper.fromBudgeterConfiguration(configuration);
        windowConfiguration.source = IpcSource.Index;
        windowConfiguration.webPreferences = windowWebConfiguration;
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, `Created Window Configuration`);

        const window = await WindowModule.createWindow(windowConfiguration);
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, `Created Window: ${window.title}`);

        await window.loadURL(load);
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, `Loaded URL: ${load}`);

        window.webContents.openDevTools();
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, "Opened Window Developer Tools");

        window.show();
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, `Showed Window: ${window.title}`);
    } catch (e) {
        console.log(e);
        MainLoggingModule.logError(IpcSource.Main, AppReadyBehavior.name, "Failed to Create Window");
        WindowModule.showErrorDialog(constants.FAILED_CONFIG_ERROR_TITLE, constants.FAILED_CONFIG_ERROR_MESSAGE)
    }
}