import * as constants from "../constants";
import ConfigurationModule from "../modules/ConfigurationModule";
import IBudgeterConfiguration from "../models/IBudgeterConfiguration";
import WindowConfigurationMapper from "../mappers/WindowConfigurationMapper";
import WindowWebConfigurationMapper from "../mappers/WindowWebConfigurationMapper";
import WindowModule from "../modules/WindowModule";

async function getBudgeterConfiguration(): Promise<IBudgeterConfiguration> {
    try {
        return await ConfigurationModule.getConfiguration();
    } catch (e: unknown) {
        WindowModule.showErrorDialog(
                constants.FAILED_CONFIG_ERROR_TITLE,
                constants.FAILED_CONFIG_ERROR_MESSAGE
        )
    }
}

export default async function () {
    const budgeterConfiguration = await getBudgeterConfiguration();

    const windowWebConfiguration = WindowWebConfigurationMapper.fromBudgeterConfiguration(budgeterConfiguration);
    const windowConfiguration = WindowConfigurationMapper.fromBudgeterConfiguration(budgeterConfiguration, windowWebConfiguration);

    const window = await WindowModule.createWindow(windowConfiguration);
    await window.loadFile(windowConfiguration.indexFile);
    window.webContents.openDevTools();
}