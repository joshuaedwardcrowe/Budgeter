import ITransaction from "../transaction/ITransaction";
import TransactionType from "../transaction/TransactionType";

export default class BudgetCategory {
    name: string;
    type: TransactionType;
    transactions: ITransaction[];

    constructor(name: string, type: TransactionType, transactions: ITransaction[]) {
        this.name = name;
        this.type = type;
        this.transactions = transactions;
    }

    public getTotalAmount(): number {
        const reduceTotalAmount = (total: number, nextTransaction: ITransaction) => total + nextTransaction.amount;
        return this.transactions.reduce<number>(reduceTotalAmount, 0);
    }
}