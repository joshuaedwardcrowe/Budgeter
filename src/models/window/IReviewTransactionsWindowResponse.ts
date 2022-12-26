import IResponse from "../IResponse";
import ITransaction from "../transaction/ITransaction";

export default interface IReviewTransactionsWindowResponse extends IResponse {
    transactions: ITransaction[]
}