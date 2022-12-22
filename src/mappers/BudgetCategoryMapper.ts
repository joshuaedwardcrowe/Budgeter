import ITransaction from "../models/transaction/ITransaction";
import IBudgetCategory from "../models/budget/IBudgetCategory";

export default class BudgetCategoryMapper {
    static fromTransactions(transactions: ITransaction[]): IBudgetCategory[] {
        const transactionCategoryNames = transactions
            .map<string>(transaction => transaction.categoryName)
            .filter((value, index, array) => array.indexOf(value) === index);

        const budgetCategories: IBudgetCategory[] = [];

        for (const name of transactionCategoryNames) {
            const transactionNameFilter = (transaction: ITransaction) => transaction.categoryName == name;
            const transactionsForCategory: ITransaction[] = transactions.filter(transactionNameFilter);

            const transactionAmountFilter = (a: number, t: ITransaction): number => a + t.amount;
            const amount = transactionsForCategory.reduce<number>(transactionAmountFilter, 0);

            const category: IBudgetCategory = { name, type: transactionsForCategory[0].type, amount };
            budgetCategories.push(category);
        }

        return budgetCategories;
    }
}