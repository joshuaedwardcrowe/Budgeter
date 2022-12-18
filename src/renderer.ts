
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
            console.clear();
            controllers.app.askForFilePath("Spendee Export");
            const filePath = await controllers.app.waitForFilePath();

            const exportInfo = SpendeeParserModule.parseExportInfo(filePath);
            console.log(exportInfo);
            this.budgets = [exportInfo, ...this.budgets]
        }
    }
}).mount('#vue-app');