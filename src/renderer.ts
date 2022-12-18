
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
            controllers.storage.askForFilePath("Spendee Export");
            const filePath = await controllers.storage.waitForFilePath();
            console.log(`FILE PATH:`);
            console.log(filePath);
        }
    }
}).mount('#vue-app');
