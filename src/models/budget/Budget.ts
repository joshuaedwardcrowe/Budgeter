import BudgetHistory from "./BudgetHistory";

export default class Budget {
    history: BudgetHistory;

    constructor(history: BudgetHistory) {
        this.history = history;
    }
}