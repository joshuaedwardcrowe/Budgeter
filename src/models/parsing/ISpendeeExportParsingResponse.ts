import IResponse from "../IResponse"
import ITransaction from "../../models/transaction/ITransaction"

export default interface ISpendeeExportParsingResponse extends IResponse {
    transactions: ITransaction[]
}