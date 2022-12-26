import BudgetCategory from "./BudgetCategory";
import TransactionType from "../transaction/TransactionType";

export default class BudgetChapter {
    categories: BudgetCategory[]

    constructor(categories: BudgetCategory[]) {
        this.categories = categories;
    }

    public getIncomeCategories(): BudgetCategory[] {
        return this.categories.filter(h => h.type === TransactionType.Income);
    }

    public getIncomeTotalAmount(): number {
        return this.getIncomeCategories().reduce((a, n) => a + n.getTotalAmount(), 0);
    }

    public getExpenseCategories(): BudgetCategory[] {
        return this.categories.filter(h => h.type === TransactionType.Expense);
    }

    public getExpenseTotalAmount(): number {
        return this.getExpenseCategories().reduce((a, n) => a + n.getTotalAmount(), 0);
    }

    public getCashFlow(): number {
        const totalIncome: number = this.getIncomeTotalAmount();
        const totalExpense: number = this.getExpenseTotalAmount();
        return  totalIncome - totalExpense;
    }
}