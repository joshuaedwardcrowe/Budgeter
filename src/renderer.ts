
import './index.css';
import { createApp } from "vue";
import * as constants from "./constants";
import SpendeeParserModule from "./modules/SpendeeExportParserModule";
import ISpendeeExportInfo from "./models/ISpendeeExportInfo";

console.log('👋 This message is being logged by "renderer.js", included via webpack');

createApp({
    data: () => ({
        currentBudget: null,
        budgets: []
    }),
    mounted: async function() {
        await this.getExistingSpendeeExports();
        },
    methods: {
        async getExistingSpendeeExports() {
            controllers.storage.askForHomeDirectoryPath();
            const homeDirectoryPath = await controllers.storage.waitForHomeDirectoryPath();

            const exportSaveDirectoryPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}`;

            controllers.storage.askForDirectoryContent(exportSaveDirectoryPath);
            const exportSaveDirectoryContent = await controllers.storage.waitForDirectoryContent();

            const isExport = (filePath: string): filePath is string => SpendeeParserModule.checkFileIsExport(filePath);
            const getExportName = (filePath: string): string => SpendeeParserModule.getExportNameFromFileName(filePath);
            const parseExportInfo = (fileName: string): ISpendeeExportInfo => SpendeeParserModule.parseExportInfoFromFileName(fileName);

            this.budgets = exportSaveDirectoryContent
                .filter<string>(isExport)
                .map<string>(getExportName)
                .map<ISpendeeExportInfo>(parseExportInfo);
        },
        async askForSpendeeExport() {
            controllers.storage.promptForFilePath("Spendee Export");
            const filePath = await controllers.storage.waitForPromptedForFilePath();

            const exportInfo = SpendeeParserModule.parseExportInfoFromFilePath(filePath);

            controllers.storage.askForHomeDirectoryPath();
            const homeDirectoryPath = await controllers.storage.waitForHomeDirectoryPath();

            const exportSaveDirectoryPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${exportInfo.fileName}.csv`;

            controllers.storage.askForFileContent(filePath);
            const fileContent = await controllers.storage.waitForFileContent();

            controllers.storage.askForFileCreation(exportSaveDirectoryPath, fileContent);
            await controllers.storage.waitForFileCreation();

            this.budgets = [exportInfo, ...this.budgets]
        }
    }
}).mount('#vue-app');