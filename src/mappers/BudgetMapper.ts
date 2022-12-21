import ISpendeeExport from "../models/ISpendeeExport";
import IBudget from "../models/budget/IBudget";
import IBudgetCategory from "../models/budget/IBudgetCategory";

export default class BudgetMapper {
    static fromSpendeeExports(spendeeExports: ISpendeeExport[]): IBudget {
        const spendeeExportCategories = spendeeExports
            .map<string>(spendeeExport => spendeeExport.categoryName)
            .filter((value, index, array) => array.indexOf(value) === index);

        const budgetCategories: IBudgetCategory[] = [];

        for (const name of spendeeExportCategories) {
            const filter = (spendeeExport: ISpendeeExport) => spendeeExport.categoryName == name;
            const exportsForCategory: ISpendeeExport[] = spendeeExports.filter(filter);

            const reducer = (n: number, currentValue: ISpendeeExport): number => n + currentValue.amount;
            const amount = exportsForCategory.reduce<number>(reducer, 0);

            const category: IBudgetCategory = { name, type: exportsForCategory[0].type, amount };
            budgetCategories.push(category);
        }

        return {
            history: budgetCategories
        }
    }
}