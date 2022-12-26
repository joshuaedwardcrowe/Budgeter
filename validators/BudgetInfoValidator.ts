export default class BudgetInfoValidator {
    public static IsBudget(filePath: string): boolean {
        const indexOfSuffix = filePath.indexOf(".budget.json"); // TODO: Move to constants.
        return indexOfSuffix >= 0;
    }
}