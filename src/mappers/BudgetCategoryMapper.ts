import ITransaction from "../models/transaction/ITransaction";
import BudgetCategory from "../models/budget/BudgetCategory";

export default class BudgetCategoryMapper {
    static fromTransactions(transactions: ITransaction[]): BudgetCategory[] {
        const transactionCategoryNames = transactions
            .map<string>(transaction => transaction.categoryName)
            .filter((value, index, array) => array.indexOf(value) === index);

        const budgetCategories: BudgetCategory[] = [];

        for (const name of transactionCategoryNames) {
            const transactionNameFilter = (transaction: ITransaction) => transaction.categoryName == name;
            const transactionsForCategory: ITransaction[] = transactions.filter(transactionNameFilter);

            const transactionAmountFilter = (a: number, t: ITransaction): number => a + t.amount;

            const category = new BudgetCategory(name, transactionsForCategory[0].type, transactionsForCategory);

            budgetCategories.push(category);
        }

        return budgetCategories;
    }
}