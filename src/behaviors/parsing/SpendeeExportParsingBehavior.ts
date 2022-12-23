import { parseString } from 'fast-csv';
import ISpendeeExportParsingRequest from "../../models/parsing/ISpendeeExportParsingRequest";
import StorageModule from "../../modules/StorageModule";
import ITransaction from "../../models/transaction/ITransaction";
import TransactionMapper from "../../mappers/TransactionMapper";
import MainIpcModule from "../../modules/MainIpcModule";
import MainLoggingModule from "../../modules/MainLoggingModule";
import ISpendeeExportParsingResponse from "../../models/parsing/ISpendeeExportParsingResponse";

const CSV_PARSING_ERROR = "error";
const CSV_PARSING_DATA = "data";
const CSV_PARSING_END = "end";

export default async function SpendeeExportParsingBehavior({ source, key, exportFilePath }: ISpendeeExportParsingRequest) {
    const fileExists = await StorageModule.tryCheckFileExists(exportFilePath);
    if (!fileExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        MainLoggingModule.logError(source, SpendeeExportParsingBehavior.name, `No File: ${exportFilePath}`);
    }

    const content = await StorageModule.readFile(exportFilePath);
    MainLoggingModule.logInfo(source, SpendeeExportParsingBehavior.name, `Got File: ${exportFilePath}`);

    const parser = parseString(content);
    const transactions: ITransaction[] = [];

    parser.on(CSV_PARSING_ERROR, error => {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        MainLoggingModule.logInfo(source, SpendeeExportParsingBehavior.name, `CSV Parsing Failed: ${error}`);
    });

    parser.on(CSV_PARSING_DATA, row => {
        const transactionCount: number = transactions.length + 1;
        MainLoggingModule.logInfo(source, SpendeeExportParsingBehavior.name, `CSV Parsing Got Data ${transactionCount}`);
        const transaction = TransactionMapper.fromCSVRow(row);
        transactions.push(transaction);
    });

    parser.on(CSV_PARSING_END, (rowCount: number) => {
        MainLoggingModule.logInfo(source, SpendeeExportParsingBehavior.name, `CSV Parsing Completed: ${rowCount} Rows`);

        transactions.shift();

        MainIpcModule.sendSuccess<ISpendeeExportParsingResponse>({
            source,
            key,
            success: true,
            transactions
        })

        MainLoggingModule.logInfo(source, SpendeeExportParsingBehavior.name, `CSV Parsing Removing Header Row [${source}]`);
    })
}