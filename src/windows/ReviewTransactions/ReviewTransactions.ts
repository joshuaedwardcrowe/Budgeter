import './ReviewTransactions.css';
import moment from "moment";
import {createApp } from "vue";

createApp({
    data: () => ({
        transactions: null
    }),
    mounted: async function() { await this.getTransactionsToReview() },
    methods: {
        async getTransactionsToReview() {
            this.transactions = await modules.windows.waitForReviewTransactionsWindow()
        }
    },
    computed: {
        header() {
            const length = this.transactions !== null ? this.transactions.length : 0;
            const categoryName = this.transactions !== null ? this.transactions[0].categoryName : "Unkown";

            return `Reviewing ${length} ${categoryName} Transactions`;
        }
    }
}).mount('#vue-app');