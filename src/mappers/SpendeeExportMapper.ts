import ISpendeeExport from "../models/ISpendeeExport";

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

export default class SpendeeExportMapper {
    static fromCSVRow(row: string[]): ISpendeeExport {
        const date = new Date(INDEX_OF_DATE);
        const amount = parseInt(row[INDEX_OF_AMOUNT], 10);
        const labels = row[INDEX_OF_LABELS].split(LABELS_SEPARATOR);

        return {
            date,
            wallet: row[INDEX_OF_WALLET],
            type: row[INDEX_OF_TYPE],
            categoryName: row[INDEX_OF_CATEGORY_NAME],
            amount,
            currency: row[INDEX_OF_CURRENCY],
            note: row[INDEX_OF_NOTE],
            labels,
            author: row[INDEX_OF_AUTHOR]
        }
    }
}