import Budget from "../models/budget/Budget";
import BudgetCategory from "../models/budget/BudgetCategory";
import BudgetChapter from "../models/budget/BudgetChapter";

export default class BudgetMapper {
    public static fromJson(json: string): Budget {
        // This one will have no functionality bc its just typescript casted. to JS its just a plain object.
        const base: Budget = JSON.parse(json);

        // TODO: Will need to support mapping chapters for accomodations.
        const historyCat = base.history.categories.map<BudgetCategory>(a => new BudgetCategory(a.name, a.type, a.transactions));
        const history = new BudgetChapter(historyCat);

        return new Budget(base.name, history);
    }
}