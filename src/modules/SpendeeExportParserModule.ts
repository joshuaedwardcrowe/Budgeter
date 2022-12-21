import * as constants from "../constants";
import ISpendeeExportInfo from "../models/ISpendeeExportInfo";

function toTitleCase(str: string): string {
    return str.replace(new RegExp(/\w\S*/g, 'g'), function(txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// TODO: Can this be done as a SpendeeExportInfo mapper instead?
export default class SpendeeParserModule {

    static checkFileIsExport(fileName: string): boolean {
        return fileName.endsWith(constants.SPENDEE_TRANSACTION_EXPORT_FILE_SUFFIX);
    }

    static getExportNameFromFileName(fileName: string): string {
        const indexOfFileSuffix = fileName.indexOf(constants.SPENDEE_TRANSACTION_EXPORT_FILE_SUFFIX);
        return fileName.substring(0, indexOfFileSuffix)
    }

    static parseExportInfoFromFileName(fileName: string) {
        const [created, accountName] = fileName.split(constants.SPENDEE_TRANSACTION_EXPORT_FILE_NAME_SEPARATOR);
        const [accountForename, accountSurname] = accountName.split(constants.SPENDEE_TRANSACTION_EXPORT_ACCOUNT_NAME_SEPARATOR);

        const formattedAccountName = toTitleCase(`${accountForename} ${accountSurname}`)

        return {
            accountName: formattedAccountName,
            created,
            fileName
        }
    }

    static parseExportInfoFromFilePath(filePath: string): ISpendeeExportInfo {
        const fileName = this._getFileNameFromFilePath(filePath);
        return this.parseExportInfoFromFileName(fileName);
    }

    private static _getFileNameFromFilePath(filePath: string): string {
        const fileName = this._getFullFileNameFromFilePath(filePath);

        const indexOfTransactionExportPrefix = this._getExportFilePrefix(fileName);
        const indexOfAfterFilePrefix = indexOfTransactionExportPrefix + constants.SPENDEE_TRANSACTION_EXPORT_FILE_PREFIX.length;
        const indexOfFileSuffix = fileName.indexOf(constants.SPENDEE_TRANSACTION_EXPORT_FILE_SUFFIX);

        if (indexOfAfterFilePrefix < 0 || indexOfFileSuffix < 0) {
            throw new Error("This is not a spendee export file");
        }

        return fileName.substring(indexOfAfterFilePrefix, indexOfFileSuffix);
    }

    private static _getFullFileNameFromFilePath(filePath: string): string {
        const indexOfTransactionExportPrefix = this._getExportFilePrefix(filePath);

        if (indexOfTransactionExportPrefix < 0) {
            throw new Error("This is not a spendee file");
        }

        return filePath.substring(indexOfTransactionExportPrefix);
    }

    private static _getExportFilePrefix(text: string): number {
        return text.indexOf(constants.SPENDEE_TRANSACTION_EXPORT_FILE_PREFIX);
    }
}