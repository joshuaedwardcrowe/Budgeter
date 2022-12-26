import RendererIpcModule from "./RendererIpcModule";
import IpcSource from "../../models/IpcSource";
import IpcKey from "../../models/IpcKey";
import ITransaction from "../../models/transaction/ITransaction";
import IReviewTransactionsWindowRequest from "../../models/window/IReviewTransactionsWindowRequest";
import IReviewTransactionsWindowResponse from "../../models/window/IReviewTransactionsWindowResponse";
class RendererIpcWindowsModule extends RendererIpcModule {
    public askForReviewTransactionsWindow(source: IpcSource, transactions: ITransaction[]): void {
        this.sendIpcMessage<IReviewTransactionsWindowRequest>({
            source,
            key: IpcKey.REVIEW_TRANSACTIONS_WINDOW,
            transactions
        })
    }
    public async waitForReviewTransactionsWindow(): Promise<ITransaction[]> {
        const { transactions } = await this.addIpcListeners<IReviewTransactionsWindowResponse>(IpcKey.REVIEW_TRANSACTIONS_WINDOW);
        return transactions;
    }
}

export default new RendererIpcWindowsModule();