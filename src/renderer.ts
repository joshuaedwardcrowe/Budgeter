
import './index.css';
import { createApp } from "vue";
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

            controllers.storage.askForHomeDirectoryPath();
            const homeDirectoryPath = await controllers.storage.waitForHomeDirectoryPath();

            const exportInfo = SpendeeParserModule.parseExportInfo(filePath);
            this.budgets = [exportInfo, ...this.budgets]
        }
    }
}).mount('#vue-app');