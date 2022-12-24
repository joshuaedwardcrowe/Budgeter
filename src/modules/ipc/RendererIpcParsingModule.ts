import RendererIpcModule from "./RendererIpcModule";
import ISpendeeExportParsingRequest from "../../models/parsing/ISpendeeExportParsingRequest";
import ISpendeeExportParsingResponse from "../../models/parsing/ISpendeeExportParsingResponse";
import ITransaction from "../../models/transaction/ITransaction";
import IpcKey from "../../models/IpcKey";
import IpcSource from "../../models/IpcSource";

class RendererIpcParsingModule extends RendererIpcModule {
    public askForSpendeeExportParsing(source: IpcSource, exportFilePath: string): void {
        this.sendIpcMessage<ISpendeeExportParsingRequest>({
            source,
            key: IpcKey.SPENDEE_EXPORT_PARSING,
            exportFilePath
        })
    }
    public async resolveSpendeeExportParsing(): Promise<ITransaction[]> {
        const { transactions } = await this.addIpcListeners<ISpendeeExportParsingResponse>(IpcKey.SPENDEE_EXPORT_PARSING);
        return transactions;
    }
}

export default new RendererIpcParsingModule();