import TransactionType from "./TransactionType";

export default interface ITransaction {
    date: Date,
    wallet: string,
    type: TransactionType,
    categoryName: string,
    amount: number,
    currency: string,
    note: string,
    labels: string[],
    author: string
}