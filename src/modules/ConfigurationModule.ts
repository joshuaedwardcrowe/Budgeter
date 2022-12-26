import * as constants from '../constants';

import StorageModule from '../modules/StorageModule';
import BudgeterConfiguration from "../models/BudgeterConfiguration";
import IBudgeterWindowConfiguration from "../models/IBudgeterWindowConfiguration"
import IpcSource from "../models/IpcSource";

const HOME_DIR = StorageModule.getHomeDirectoryPath();
const HOME_CONFIG_FOLDER_PATH = `${HOME_DIR}/${constants.CONFIG_FOLDER_NAME}`;
const HOME_CONFIG_FILE_PATH = `${HOME_CONFIG_FOLDER_PATH}/${constants.CONFIG_FILE_NAME}`

export default class ConfigurationModule {
    public static async getConfiguration(): Promise<BudgeterConfiguration> {
        const folderExists: boolean = await StorageModule.tryCheckDirectoryExists(HOME_CONFIG_FOLDER_PATH);
        if (!folderExists) {
            const configuration = this.getDefaultConfiguration();
            const fileContents: string = JSON.stringify(configuration);

            await StorageModule.createFolder(HOME_CONFIG_FOLDER_PATH);
            await StorageModule.createFile(HOME_CONFIG_FILE_PATH, fileContents);

            return configuration;
        }

        const fileExists: boolean = await StorageModule.tryCheckFileExists(HOME_CONFIG_FILE_PATH);
        if (!fileExists) {
            const configuration = this.getDefaultConfiguration();
            const fileContents: string = JSON.stringify(configuration);

            await StorageModule.createFile(HOME_CONFIG_FILE_PATH, fileContents);

            return configuration;
        }

        const fileContents = await StorageModule.readFile(HOME_CONFIG_FILE_PATH);
        return JSON.parse(fileContents);
    }
    private static getDefaultConfiguration(): BudgeterConfiguration {
        return new BudgeterConfiguration([IpcSource.Index].map(this.getDefaultWindowConfiguration));
    }
    private static getDefaultWindowConfiguration(title: IpcSource): IBudgeterWindowConfiguration {
        return {
            title,
            show: constants.DEFAULT_WINDOW_SHOW,
            height: constants.DEFAULT_WINDOW_HEIGHT,
            width: constants.DEFAULT_WINDOW_WIDTH,
            webPreferences: {
                nodeIntegration: constants.DEFAULT_WINDOW_NODE_INTEGRATION,
                contextIsolation: constants.DEFAULT_WINDOW_CONTEXT_ISOLATION
            }
        }
    }
}