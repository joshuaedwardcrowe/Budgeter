import RendererIpcModule from "./RendererIpcModule";
import ISpendeeExportParsingRequest from "../models/parsing/ISpendeeExportParsingRequest";
import ISpendeeExportParsingResponse from "../models/parsing/ISpendeeExportParsingResponse";
import ISpendeeExport from "../models/ISpendeeExport";
import IpcKey from "../models/IpcKey";

class RendererIpcParsingModule extends RendererIpcModule {
    public askForSpendeeExportParsing(exportFilePath: string): void {
        const request: ISpendeeExportParsingRequest = {
            channel: IpcKey.SPENDEE_EXPORT_PARSING,
            exportFilePath: exportFilePath
        };

        this.sendIpcMessage<ISpendeeExportParsingRequest>(request.channel, request);
    }
    public async resolveSpendeeExportParsing(): Promise<ISpendeeExport[]> {
        const response = await this.addIpcListeners<ISpendeeExportParsingResponse>(IpcKey.SPENDEE_EXPORT_PARSING);
        return response.exports;
    }
}

export default new RendererIpcParsingModule();