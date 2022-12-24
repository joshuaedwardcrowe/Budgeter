import * as constants from '../constants';

import StorageModule from '../modules/StorageModule';
import IBudgeterConfiguration from "../models/IBudgeterConfiguration";

const HOME_DIR = StorageModule.getHomeDirectoryPath();
const HOME_CONFIG_FOLDER_PATH = `${HOME_DIR}/${constants.CONFIG_FOLDER_NAME}`;
const HOME_CONFIG_FILE_PATH = `${HOME_CONFIG_FOLDER_PATH}/${constants.CONFIG_FILE_NAME}`

const DefaultBudgeterConfig: IBudgeterConfiguration = {
    windowTitle: constants.DEFAULT_WINDOW_TITLE,
    windowShow: constants.DEFAULT_WINDOW_SHOW,
    windowHeight: constants.DEFAULT_WINDOW_HEIGHT,
    windowWidth: constants.DEFAULT_WINDOW_WIDTH,
    nodeIntegration: constants.DEFAULT_WINDOW_NODE_INTEGRATION,
    contextIsolation: constants.DEFAULT_WINDOW_CONTEXT_ISOLATION
};

export default class ConfigurationModule {
    public static async getConfiguration(): Promise<IBudgeterConfiguration> {
        const folderExists: boolean = await StorageModule.tryCheckDirectoryExists(HOME_CONFIG_FOLDER_PATH);
        if (!folderExists) {
            const fileContents: string = JSON.stringify(DefaultBudgeterConfig);

            await StorageModule.createFolder(HOME_CONFIG_FOLDER_PATH);
            await StorageModule.createFile(HOME_CONFIG_FILE_PATH, fileContents);

            return DefaultBudgeterConfig;
        }

        const fileExists: boolean = await StorageModule.tryCheckFileExists(HOME_CONFIG_FILE_PATH);
        if (!fileExists) {
            const fileContents: string = JSON.stringify(DefaultBudgeterConfig);

            await StorageModule.createFile(HOME_CONFIG_FILE_PATH, fileContents);

            return DefaultBudgeterConfig;
        }

        const fileContents = await StorageModule.readFile(HOME_CONFIG_FILE_PATH);
        return JSON.parse(fileContents);
    }
}