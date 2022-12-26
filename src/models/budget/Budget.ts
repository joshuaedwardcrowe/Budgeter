import BudgetChapter from "./BudgetChapter";
import IBudgetAllocation from "./IBudgetAllocation";
import BudgetCategory from "./BudgetCategory";

export default class Budget {
    // TODO: Make budgets careless about Spendee Exports by using the name to save the file instead of Spendee's file name.
    name: string;
    created: Date;
    accomodations: BudgetChapter;
    history: BudgetChapter;
    allocations: IBudgetAllocation[]

    constructor(name: string, history: BudgetChapter) {
        this.name = name;
        this.created = new Date();
        this.accomodations = new BudgetChapter([]);
        this.history = history;
        this.allocations = [];
    }
}