import { parseString } from 'fast-csv';
import ISpendeeExportParsingRequest from "../../models/parsing/ISpendeeExportParsingRequest";
import StorageModule from "../../modules/StorageModule";
import ITransaction from "../../models/transaction/ITransaction";
import TransactionMapper from "../../mappers/TransactionMapper";
import MainIpcModule from "../../modules/ipc/MainIpcModule";
import ISpendeeExportParsingResponse from "../../models/parsing/ISpendeeExportParsingResponse";
import MainConsumerLoggingModule from "../../modules/logging/MainConsumerLoggingModule";

const CSV_PARSING_ERROR = "error";
const CSV_PARSING_DATA = "data";
const CSV_PARSING_END = "end";

export default async function SpendeeExportParsingConsumer(logger: MainConsumerLoggingModule, { source, key, exportFilePath }: ISpendeeExportParsingRequest) {
    const fileExists = await StorageModule.tryCheckFileExists(exportFilePath);
    if (!fileExists) {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        logger.logError(`No File: ${exportFilePath}`);
    }

    const content = await StorageModule.readFile(exportFilePath);
    logger.logInfo(`Got File: ${exportFilePath}`);

    const parser = parseString(content);
    const transactions: ITransaction[] = [];

    // Arrays are zero-indexed, so count is max index = 1
    const getTransactionLength = () => transactions.length + 1;

    parser.on(CSV_PARSING_ERROR, error => {
        MainIpcModule.sendFailure({
            source,
            key,
            success: false
        })

        logger.logInfo(`CSV Parsing Failed: ${error}`);
    });

    parser.on(CSV_PARSING_DATA, row => {
        logger.logInfo(`CSV Parsing Got Data ${getTransactionLength()}`);
        const transaction = TransactionMapper.fromCSVRow(row);
        transactions.push(transaction);
    });

    parser.on(CSV_PARSING_END, () => {
        logger.logInfo("CSV Parsing Removing Header Row");
        transactions.shift();

        MainIpcModule.sendSuccess<ISpendeeExportParsingResponse>({
            source,
            key,
            success: true,
            transactions
        })

        logger.logInfo(`CSV Parsing Completed: ${getTransactionLength()} Rows`);
    })
}