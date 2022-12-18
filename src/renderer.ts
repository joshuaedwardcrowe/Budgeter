
import './index.css';
import { createApp } from "vue";

console.log('👋 This message is being logged by "renderer.js", included via webpack');

createApp({
    data: () => ({
        currentBudget: null,
        budgets: [
            {
                account: "Monzo Premium",
                added: "2022-12-08"
            }
        ]
    }),
    methods: {
        askForSpendeeExport: async () => {
            controllers.app.askForFilePath("Spendee Export");
            const filePath = await controllers.app.waitForFilePath();
            console.log(filePath);

            controllers.storage.askForFileContent(filePath);
            const fileContent = await controllers.storage.waitForFileContent();
            console.log(fileContent);
        }
    }
}).mount('#vue-app');
