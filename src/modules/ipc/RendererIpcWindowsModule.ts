import RendererIpcModule from "./RendererIpcModule";
import IpcSource from "../../models/IpcSource";
import IpcKey from "../../models/IpcKey";
import ITransaction from "../../models/transaction/ITransaction";
import IReviewTransactionsWindowRequest from "../../models/window/IReviewTransactionsWindowRequest";
class RendererIpcWindowsModule extends RendererIpcModule {
    public askForReviewTransactionsWindow(source: IpcSource, transactions: ITransaction[]): void {
        this.sendIpcMessage<IReviewTransactionsWindowRequest>({
            source,
            key: IpcKey.REVIEW_TRANSACTIONS_WINDOW,
            transactions
        })
    }
    public async waitForReviewTransactionsWindow(): Promise<void> {
        await this.addIpcListeners(IpcKey.REVIEW_TRANSACTIONS_WINDOW);
    }
}

export default new RendererIpcWindowsModule();