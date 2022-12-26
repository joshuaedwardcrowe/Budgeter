import BudgetChapter from "./BudgetChapter";
import IBudgetAllocation from "./IBudgetAllocation";

export default class Budget {
    // TODO: Make budgets careless about Spendee Exports by using the name to save the file instead of Spendee's file name.
    name: string;
    accomodations: BudgetChapter;
    history: BudgetChapter;
    allocations: IBudgetAllocation[]

    constructor(name: string, history: BudgetChapter) {
        this.name = name;
        this.accomodations = new BudgetChapter([]);
        this.history = history;
        this.allocations = [];
    }

    getCashFlow(): number {
        // TODO: This needs to actually use the total income from accomodations + total planned budget from allocations.
        return 200;
    }
}