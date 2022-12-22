import RendererIpcModule from "./RendererIpcModule";
import ISpendeeExportParsingRequest from "../models/parsing/ISpendeeExportParsingRequest";
import ISpendeeExportParsingResponse from "../models/parsing/ISpendeeExportParsingResponse";
import ITransaction from "../models/ITransaction";
import IpcKey from "../models/IpcKey";

class RendererIpcParsingModule extends RendererIpcModule {
    public askForSpendeeExportParsing(exportFilePath: string): void {
        const request: ISpendeeExportParsingRequest = {
            key: IpcKey.SPENDEE_EXPORT_PARSING,
            exportFilePath: exportFilePath
        };

        this.sendIpcMessage<ISpendeeExportParsingRequest>(request.key, request);
    }
    public async resolveSpendeeExportParsing(): Promise<ITransaction[]> {
        const response = await this.addIpcListeners<ISpendeeExportParsingResponse>(IpcKey.SPENDEE_EXPORT_PARSING);
        return response.transactions;
    }
}

export default new RendererIpcParsingModule();