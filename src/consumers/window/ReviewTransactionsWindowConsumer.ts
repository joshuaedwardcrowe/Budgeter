import MainConsumerLoggingModule from "../../modules/logging/MainConsumerLoggingModule";
import WindowModule from "../../modules/WindowModule";
import ConfigurationModule from "../../modules/ConfigurationModule";
import IReviewTransactionsWindowRequest from "../../models/window/IReviewTransactionsWindowRequest";
import IpcSource from "../../models/IpcSource";

export default async function ReviewTransactionsWindowConsumer(logger: MainConsumerLoggingModule, request: IReviewTransactionsWindowRequest) {

    console.log(request.transactions);
    // console.log(`GONNA REVIEW ${request.transactions.length} Transactions at some point`);

    const config = await ConfigurationModule.getConfiguration();
    const reviewTransactionsConfiguration = config.windows.find(window => window.title === IpcSource.ReviewTransactions);

    WindowModule.createWindow(IpcSource.ReviewTransactions, reviewTransactionsConfiguration);
    logger.logInfo(`Created Window: ${IpcSource.ReviewTransactions}`);

}