import './index.css';
import { createApp } from "vue";
import * as constants from "./constants";
import SpendeeParserModule from "./modules/SpendeeExportParserModule";
import ISpendeeExportInfo from "./models/ISpendeeExportInfo";
import RendererLoggingModule from "./modules/RendererLoggingModule";

createApp({
    data: () => ({
        currentBudget: null,
        exports: []
    }),
    mounted: async function() {
        await this.getExistingSpendeeExports();
    },
    methods: {
        async getExistingSpendeeExports() {
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const exportSaveDirectoryPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}`;

            controllers.storage.askForDirectoryContent(exportSaveDirectoryPath);
            RendererLoggingModule.logInfo("getExistingSpendeeExports", `Got Directory Content: ${exportSaveDirectoryPath}`);

            const exportSaveDirectoryContent = await controllers.storage.resolveDirectoryContent();
            RendererLoggingModule.logInfo("getExistingSpendeeExports", `Got Directory Content: ${exportSaveDirectoryContent}`);

            const isExport = (filePath: string): filePath is string => SpendeeParserModule.checkFileIsExport(filePath);
            const getExportName = (filePath: string): string => SpendeeParserModule.getExportNameFromFileName(filePath);
            const parseExportInfo = (fileName: string): ISpendeeExportInfo => SpendeeParserModule.parseExportInfoFromFileName(fileName);

            this.exports = exportSaveDirectoryContent
                .filter<string>(isExport)
                .map<string>(getExportName)
                .map<ISpendeeExportInfo>(parseExportInfo);

            RendererLoggingModule.logInfo("getExistingSpendeeExports", `Set ${this.exports.length} Exports`);
        },
        async askForSpendeeExport() {
            controllers.storage.askToPromptForFilePath("Spendee Export");
            RendererLoggingModule.logInfo("askForSpendeeExport", "Asking For File Path to Spendee Export");

            const filePath = await controllers.storage.resolvePromptedForFilePath();
            RendererLoggingModule.logInfo("askForSpendeeExport", `Got Spendee Export File Path: ${filePath}`);

            const exportInfo = SpendeeParserModule.parseExportInfoFromFilePath(filePath);

            const homeDirectoryPath = await this.getHomeDirectoryPath();

            const exportSaveDirectoryPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${exportInfo.fileName}.csv`;

            controllers.storage.askForFileContent(filePath);
            RendererLoggingModule.logInfo("askForSpendeeExport", `Asked for File Content: ${filePath}`);

            const fileContent = await controllers.storage.resolveFileContent();
            RendererLoggingModule.logInfo("askForSpendeeExport", `Got File Content: ${filePath}`);

            controllers.storage.askForFileCreation(exportSaveDirectoryPath, fileContent);
            RendererLoggingModule.logInfo("askForSpendeeExport", `Ask For File Creation: ${exportSaveDirectoryPath}`);

            await controllers.storage.waitForFileCreation();
            RendererLoggingModule.logInfo("askForSpendeeExport", `File Created: ${exportSaveDirectoryPath}`);

            this.exports = [exportInfo, ...this.exports]
        },
        async getHomeDirectoryPath() {
            controllers.storage.askForHomeDirectoryPath();
            RendererLoggingModule.logInfo("getHomeDirectoryPath", "Asked for Home Directory Path");

            const homeDirectoryPath = await controllers.storage.resolveHomeDirectoryPath();
            RendererLoggingModule.logInfo("getHomeDirectoryPath", `Got Home Directory Path: ${homeDirectoryPath}`);

            return homeDirectoryPath;
        }
    }
}).mount('#vue-app');

RendererLoggingModule.clear();
RendererLoggingModule.logInfo("Renderer", "App Launched");