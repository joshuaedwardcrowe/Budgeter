import './index.css';
import {createApp, toRaw } from "vue";
import SpendeeParserModule from "./modules/SpendeeExportParserModule";
import ISpendeeExportInfo from "./models/ISpendeeExportInfo";
import RendererLoggingModule from "./modules/logging/RendererLoggingModule";
import ITransaction from "./models/transaction/ITransaction";
import BudgetCategoryMapper from "./mappers/BudgetCategoryMapper";
import Budget from "./models/budget/Budget";
import BudgetHistory from "./models/budget/BudgetHistory";
import * as constants from "./constants";
import IpcSource from "./models/IpcSource";
import BudgetCategory from "./models/budget/BudgetCategory";

// TODO: Step 2 is to store the Budget model generated from CSV in a JSON file.


createApp({
    data: () => ({
        currentBudget: null,
        spendeeExports: [],
        homeDirectoryPath: null
    }),
    mounted: async function() { await this.getExistingSpendeeExports(); },
    methods: {
        backToHome() {
            this.currentBudget = null;
        },
        async reviewTransactions(category: BudgetCategory) {
            const transactions = toRaw(category.transactions);
            modules.windows.askForReviewTransactionsWindow(IpcSource.Index, transactions);
        },
        async createNewBudget(info: ISpendeeExportInfo) {
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const spendeeExportPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${info.fileName}.csv`;

            modules.parsing.askForSpendeeExportParsing(IpcSource.Index, spendeeExportPath);
            const transactions: ITransaction[] = await modules.parsing.resolveSpendeeExportParsing();

            const categories = BudgetCategoryMapper.fromTransactions(transactions);
            const history = new BudgetHistory(categories);

            this.currentBudget = new Budget(history);
        },
        async deleteSpendeeExport(info: ISpendeeExportInfo) {
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const spendeeExportPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${info.fileName}.csv`;

            modules.file.askForFileDeletion(IpcSource.Index, spendeeExportPath);
            await modules.file.waitForFileDeletion();

            this.spendeeExports = this.spendeeExports.filter(se => !se.fileName == info.fileName);
        },
        async getExistingSpendeeExports() {
            // TODO: Can I use session storage to reduce the effort here.
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const budgeterDirectoryPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}`;

            modules.directory.askForDirectoryContent(IpcSource.Index, budgeterDirectoryPath);
            RendererLoggingModule.logInfo("getExistingSpendeeExports", `Asking For Directory Content: ${homeDirectoryPath}`);

            const exportSaveDirectoryContent = await modules.directory.resolveDirectoryContent(IpcSource.Index);
            RendererLoggingModule.logInfo("getExistingSpendeeExports", `Got Directory Content: ${exportSaveDirectoryContent}`);

            const isExport = (filePath: string): filePath is string => SpendeeParserModule.checkFileIsExport(filePath);
            const getExportName = (filePath: string): string => SpendeeParserModule.getExportNameFromFileName(filePath);
            const parseExportInfo = (fileName: string): ISpendeeExportInfo => SpendeeParserModule.parseExportInfoFromFileName(fileName);

            this.spendeeExports = exportSaveDirectoryContent
                .filter<string>(isExport)
                .map<string>(getExportName)
                .map<ISpendeeExportInfo>(parseExportInfo);

            RendererLoggingModule.logInfo("getExistingSpendeeExports", `Set ${this.spendeeExports.length} Exports`);
        },
        async askForSpendeeExport() {
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const downloadsPath = `${homeDirectoryPath}/${constants.ENVIRONMENT_DOWNLOADS_FOLDER}`;

            modules.file.askToPromptForFilePath(IpcSource.Index, downloadsPath, "Spendee Export");
            RendererLoggingModule.logInfo("askForSpendeeExport", "Asking For File Path to Spendee Export");

            const filePath = await modules.file.resolvePromptedForFilePath();
            RendererLoggingModule.logInfo("askForSpendeeExport", `Got Spendee Export File Path: ${filePath}`);

            const exportInfo = SpendeeParserModule.parseExportInfoFromFilePath(filePath);

            const configPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}`;

            // TODO: There must be a way to not put CSV in here and in Export Info FileName instead.
            const exportSaveDirectoryPath = `${configPath}/${exportInfo.fileName}.csv`;

            modules.file.askForFileContent(IpcSource.Index, filePath);
            RendererLoggingModule.logInfo("askForSpendeeExport", `Asked for File Content: ${filePath}`);

            const fileContent = await modules.file.resolveFileContent();
            RendererLoggingModule.logInfo("askForSpendeeExport", `Got File Content: ${filePath}`);

            modules.file.askForFileCreation(IpcSource.Index, exportSaveDirectoryPath, fileContent);
            RendererLoggingModule.logInfo("askForSpendeeExport", `Ask For File Creation: ${exportSaveDirectoryPath}`);

            await modules.file.waitForFileCreation();
            RendererLoggingModule.logInfo("askForSpendeeExport", `File Created: ${exportSaveDirectoryPath}`);

            this.spendeeExports = [exportInfo, ...this.spendeeExports]
        },
        async getHomeDirectoryPath() {
            if (!this.homeDirectoryPath) {
                modules.directory.askForHomeDirectoryPath(IpcSource.Index);
                RendererLoggingModule.logInfo("getHomeDirectoryPath", "Asked for Home Directory Path");

                const homeDirectoryPath = await modules.directory.resolveHomeDirectoryPath();
                RendererLoggingModule.logInfo("getHomeDirectoryPath", `Got Home Directory Path: ${homeDirectoryPath}`);

                this.homeDirectoryPath = homeDirectoryPath;
            }

            return this.homeDirectoryPath;
        }
    }
}).mount('#vue-app');

RendererLoggingModule.clear();
RendererLoggingModule.logInfo("Renderer", "App Launched");