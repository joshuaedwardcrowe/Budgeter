import IRequest from "../IRequest";
import ITransaction from "../transaction/ITransaction";

export default interface IReviewTransactionsWindowRequest extends IRequest {
    transactions: ITransaction[]
}