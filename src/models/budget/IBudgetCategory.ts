import TransactionType from "../transaction/TransactionType";

export default interface IBudgetCategory {
    name: string,
    type: TransactionType,
    amount: number
}