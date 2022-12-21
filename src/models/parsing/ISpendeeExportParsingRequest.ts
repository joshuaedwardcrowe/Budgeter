import IRequest from "../IRequest";

export default interface ISpendeeExportParsingRequest extends IRequest {
    exportFilePath: string
}