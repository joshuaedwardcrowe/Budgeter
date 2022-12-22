import ITransaction from "../models/transaction/ITransaction";
import TransactionType from "../models/transaction/TransactionType";
import TransactionCurrency from "../models/transaction/TransactionCurrency";

// TODO: Move to constants.
const LABELS_SEPARATOR = ",";

const INDEX_OF_DATE = 0;
const INDEX_OF_WALLET = 1;
const INDEX_OF_TYPE = 2;
const INDEX_OF_CATEGORY_NAME = 3;
const INDEX_OF_AMOUNT = 4;
const INDEX_OF_CURRENCY = 5;
const INDEX_OF_NOTE = 6;
const INDEX_OF_LABELS = 7;
const INDEX_OF_AUTHOR = 8;

export default class TransactionMapper {
    static fromCSVRow(row: string[]): ITransaction {
        const chosenType = row[INDEX_OF_TYPE] as keyof typeof TransactionType;
        const chosenCurrency = row[INDEX_OF_CURRENCY] as keyof typeof TransactionCurrency;
        const parsedAmount = parseInt(row[INDEX_OF_AMOUNT], 10);

        const date = new Date(INDEX_OF_DATE);
        const type = TransactionType[chosenType];
        const amount = Math.abs(parsedAmount);
        const currency = TransactionCurrency[chosenCurrency];
        const labels = row[INDEX_OF_LABELS].split(LABELS_SEPARATOR);
        
        return {
            date,
            wallet: row[INDEX_OF_WALLET],
            type,
            categoryName: row[INDEX_OF_CATEGORY_NAME],
            amount,
            currency,
            note: row[INDEX_OF_NOTE],
            labels,
            author: row[INDEX_OF_AUTHOR]
        }
    }
}