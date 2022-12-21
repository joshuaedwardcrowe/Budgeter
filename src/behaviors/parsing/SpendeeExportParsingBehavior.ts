import {parseString} from 'fast-csv';
import ISpendeeExportParsingRequest from "../../models/parsing/ISpendeeExportParsingRequest";
import StorageModule from "../../modules/StorageModule";
import ISpendeeExport from "../../models/ISpendeeExport";
import SpendeeExportMapper from "../../mappers/SpendeeExportMapper";
import MainIcpModule from "../../modules/MainIcpModule";
import IpcKey from "../../models/IpcKey";
import MainLoggingModule from "../../modules/MainLoggingModule";
import ISpendeeExportParsingResponse from "../../models/parsing/ISpendeeExportParsingResponse";

const CSV_PARSING_ERROR = "error";
const CSV_PARSING_DATA = "data";
const CSV_PARSING_END = "end";

export default async function (request: ISpendeeExportParsingRequest) {
    const fileExists = await StorageModule.tryCheckFileExists(request.exportFilePath);
    if (!fileExists) {
        MainLoggingModule.logError("SpendeeExportParsingBehavior", `No File: ${request.exportFilePath}`);
        MainIcpModule.sendFailure(IpcKey.SPENDEE_EXPORT_PARSING);
    }

    const content = await StorageModule.readFile(request.exportFilePath);
    MainLoggingModule.logInfo("SpendeeExportParsingBehavior", `Got File: ${request.exportFilePath}`);

    const parser = parseString(content);
    const exports: ISpendeeExport[] = [];

    parser.on(CSV_PARSING_ERROR, error => {
        MainLoggingModule.logInfo("SpendeeExportParsingBehavior", `CSV Parsing Failed: ${error}`);
        MainIcpModule.sendFailure(IpcKey.SPENDEE_EXPORT_PARSING);
    });

    parser.on(CSV_PARSING_DATA, row => {
        MainLoggingModule.logInfo("SpendeeExportParsingBehavior", `CSV Parsing Got Data: ${row}`);
        const spendeeExport = SpendeeExportMapper.fromCSVRow(row);
        exports.push(spendeeExport);
    });

    parser.on(CSV_PARSING_END, (rowCount: number) => {
        MainLoggingModule.logInfo("SpendeeExportParsingBehavior", `CSV Parsing Completed: ${rowCount} Rows`);

        const response: ISpendeeExportParsingResponse = {
            success: true,
            exports
        };

        MainIcpModule.sendSuccess(IpcKey.SPENDEE_EXPORT_PARSING, response);
    })
}