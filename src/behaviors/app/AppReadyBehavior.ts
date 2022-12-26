import WindowModule from "../../modules/WindowModule";
import MainLoggingModule from "../../modules/logging/MainLoggingModule";
import ConfigurationModule from "../../modules/ConfigurationModule";
import BudgeterConfiguration from "../../models/BudgeterConfiguration";
import IpcSource from "../../models/IpcSource";
import * as constants from "../../constants";
import IBudgeterWindowConfiguration from "../../models/IBudgeterWindowConfiguration";

export default async function AppReadyBehavior(load: string, preload: string) {
    try {
        const configuration: BudgeterConfiguration = await ConfigurationModule.getConfiguration();
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, "Successfully Got Config");

        const indexConfiguration: IBudgeterWindowConfiguration = configuration.windows.find(window => window.title == IpcSource.Index)
        indexConfiguration.webPreferences.preload = preload;
        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, `Created Window Web Configuration`);

        MainLoggingModule.logInfo(IpcSource.Main, AppReadyBehavior.name, `Created Window Configuration`);

        const window = await WindowModule.createWindow(IpcSource.Index, indexConfiguration);
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