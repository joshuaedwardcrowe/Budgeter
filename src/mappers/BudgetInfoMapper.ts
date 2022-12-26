import IBudgetInfo from "../models/IBudgetInfo";

export default class BudgetInfoMapper {
    public static fromFilePath(fileName: string): IBudgetInfo {
        const indexOfSuffix = fileName.indexOf(".budget.json"); // TODO: Move to constants.
        const name = fileName.substring(0, indexOfSuffix);

        return {
            name,
            fileName
        }
    }
}