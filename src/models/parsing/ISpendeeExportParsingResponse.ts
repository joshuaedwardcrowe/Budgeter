import IResponse from "../IResponse"
import ISpendeeExport from "../ISpendeeExport";

export default interface ISpendeeExportParsingResponse extends IResponse {
    exports: ISpendeeExport[]
}