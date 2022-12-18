
import './index.css';
import { createApp } from "vue";
import * as constants from "./constants";
import SpendeeParserModule from "./modules/SpendeeExportParserModule";

console.log('👋 This message is being logged by "renderer.js", included via webpack');

createApp({
    data: () => ({
        currentBudget: null,
        budgets: []
    }),
    methods: {
        async askForSpendeeExport() {
            controllers.storage.promptForFilePath("Spendee Export");
            const filePath = await controllers.storage.waitForPromptedForFilePath();

            const exportInfo = SpendeeParserModule.parseExportInfo(filePath);

            controllers.storage.askForHomeDirectoryPath();
            const homeDirectoryPath = await controllers.storage.waitForHomeDirectoryPath();

            const exportSaveDirectoryPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${exportInfo.created}`;
            console.log(exportSaveDirectoryPath);

            controllers.storage.askForFileContent(filePath);
            const fileContent = await controllers.storage.waitForFileContent();
            console.log(fileContent);

            // TODO: Create file in Home Directory Budgeter Folder.
            // TODO: Load all files in Home Directory Budgeter Folder into table.

            this.budgets = [exportInfo, ...this.budgets]
        }
    }
}).mount('#vue-app');