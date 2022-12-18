import * as constants from "../constants";
import ISpendeeExportInfo from "../models/ISpendeeExportInfo";

function toTitleCase(str: string): string {
    return str.replace(new RegExp(/\w\S*/g, 'g'), function(txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


export default class SpendeeParserModule {

    static parseExportInfo(filePath: string): ISpendeeExportInfo {
        const fileName = this._getFileNameFromFilePath(filePath);
        console.log(`FILE NAME: ${fileName}`);

        const [created, accountName] = fileName.split(constants.SPENDEE_TRANSACTION_EXPORT_FILE_NAME_SEPARATOR);
        const [accountForename, accountSurname] = accountName.split(constants.SPENDEE_TRANSACTION_EXPORT_ACCOUNT_NAME_SEPARATOR);

        const formattedAccountName = toTitleCase(`${accountForename} ${accountSurname}`)
        const formattedCreated = new Date(created);

        return {
            accountName: formattedAccountName,
            created: formattedCreated
        }
    }

    private static _getFileNameFromFilePath(filePath: string): string {
        const fileName = this._getFullFileNameFromFilePath(filePath);
        console.log(`FULL FILE NAME: ${fileName}`);

        const indexOfTransactionExportPrefix = this._getExportFilePrefix(fileName);

        const indexOfAfterFilePrefix = indexOfTransactionExportPrefix + constants.SPENDEE_TRANSACTION_EXPORT_FILE_PREFIX.length;
        console.log(`START INDEX: ${indexOfAfterFilePrefix}`);

        const indexOfFileSuffix = fileName.indexOf(constants.SPENDEE_TRANSACTION_EXPORT_FILE_SUFFIX);
        console.log(`STOP INDEX: ${indexOfFileSuffix}`);

        if (indexOfAfterFilePrefix < 0 || indexOfFileSuffix < 0) {
            throw new Error("This is not a spendee export file");
        }

        return fileName.substring(indexOfAfterFilePrefix, indexOfFileSuffix);
    }

    private static _getFullFileNameFromFilePath(filePath: string): string {
        const indexOfTransactionExportPrefix = this._getExportFilePrefix(filePath);
        console.log(`EXPORT PREFIX INDEX: ${indexOfTransactionExportPrefix}`);

        if (indexOfTransactionExportPrefix < 0) {
            throw new Error("This is not a spendee file");
        }

        return filePath.substring(indexOfTransactionExportPrefix);
    }

    private static _getExportFilePrefix(text: string): number {
        return text.indexOf(constants.SPENDEE_TRANSACTION_EXPORT_FILE_PREFIX);
    }
}