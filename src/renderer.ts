import './index.css';
import {createApp, toRaw } from "vue";
import SpendeeParserModule from "./modules/SpendeeExportParserModule";
import ISpendeeExportInfo from "./models/ISpendeeExportInfo";
import RendererLoggingModule from "./modules/logging/RendererLoggingModule";
import ITransaction from "./models/transaction/ITransaction";
import BudgetCategoryMapper from "./mappers/BudgetCategoryMapper";
import Budget from "./models/budget/Budget";
import BudgetChapter from "./models/budget/BudgetChapter";
import * as constants from "./constants";
import IpcSource from "./models/IpcSource";
import BudgetCategory from "./models/budget/BudgetCategory";
import BudgetInfoValidator from "../validators/BudgetInfoValidator";
import BudgetInfoMapper from "./mappers/BudgetInfoMapper";
import IBudgetInfo from "./models/IBudgetInfo";
import BudgetMapper from "./mappers/BudgetMapper";

createApp({
    data: () => ({
        currentBudget: null,
        budgets: [],
        creatingNewBudget: false,
        newBudgetName: null,
        newBudgetExport: null,
        spendeeExports: [],
        homeDirectoryPath: null
    }),
    mounted: async function() { await this.getExisting(); },
    methods: {
        backToHome() {
            this.currentBudget = null;
        },
        async openBudget(info: IBudgetInfo) {
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const budgetPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${info.fileName}`;

            modules.file.askForFileContent(IpcSource.Index, budgetPath);
            const fileContent: string = await modules.file.resolveFileContent();

            const budget: Budget = BudgetMapper.fromJson(fileContent);
            this.currentBudget = budget;
        },
        async deleteBudget(info: IBudgetInfo) {
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const budgetPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${info.fileName}`;

            modules.file.askForFileDeletion(IpcSource.Index, budgetPath);
            await modules.file.waitForFileDeletion();

            this.budgets = this.budgets.filter((budget: IBudgetInfo) => budget.name !== info.name);
        },
        async reviewTransactions(category: BudgetCategory) {
            const transactions = toRaw(category.transactions);
            modules.windows.askForReviewTransactionsWindow(IpcSource.Index, transactions);
        },
        getNameForBudgetWithoutSpendeeExport() {
            this.creatingNewBudget = true;
        },
        getNameForBudgetWithSpendeeExport(info: ISpendeeExportInfo) {
            this.creatingNewBudget = true
            this.newBudgetExport = info;
        },
        async createNewBudget() {
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const spendeeExportPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${this.newBudgetExport.fileName}.csv`;

            modules.parsing.askForSpendeeExportParsing(IpcSource.Index, spendeeExportPath);
            const transactions: ITransaction[] = await modules.parsing.resolveSpendeeExportParsing();

            const categories = BudgetCategoryMapper.fromTransactions(transactions);
            const history = new BudgetChapter(categories);
            const budget = new Budget(this.newBudgetName, history);

            // TODO: This logic probs needs encapsulating somewhere more constant.
            const budgetFileNameWithoutSuffix = budget.name.split(' ').join('-');
            const budgetFileName = `${budgetFileNameWithoutSuffix}.budget.json`;

            const budgetPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${budgetFileName}`;
            const budgetContent = JSON.stringify(budget);

            modules.file.askForFileCreation(IpcSource.Index, budgetPath, budgetContent);
            await modules.file.waitForFileCreation();

            const budgetInfo: IBudgetInfo = {
                name: budget.name,
                fileName: budgetFileName
            }

            this.budgets = [...this.budgets, budgetInfo];

            // Reset state.
            this.newBudgetName = null;
            this.newBudgetExport = null;
            this.creatingNewBudget = false;
        },
        async deleteSpendeeExport(info: ISpendeeExportInfo) {
            // Clear set new budget export if we're deleting it.
            if (this.newBudgetExport === info) {
                this.newBudgetExport = null;
            }

            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const spendeeExportPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}/${info.fileName}.csv`;

            modules.file.askForFileDeletion(IpcSource.Index, spendeeExportPath);
            await modules.file.waitForFileDeletion();

            this.spendeeExports = this.spendeeExports.filter((se: ISpendeeExportInfo) => se.fileName !== info.fileName);
        },
        async getExisting() {
            // TODO: Can I use session storage to reduce the effort here.
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const budgeterDirectoryPath = `${homeDirectoryPath}/${constants.CONFIG_FOLDER_NAME}`;

            modules.directory.askForDirectoryContent(IpcSource.Index, budgeterDirectoryPath);
            RendererLoggingModule.logInfo(this.getExisting.name, `Asking For Directory Content: ${budgeterDirectoryPath}`);

            const configFolderContents = await modules.directory.resolveDirectoryContent();
            RendererLoggingModule.logInfo(this.getExisting.name, `Got Directory Content: ${budgeterDirectoryPath}`);

            await this.getExistingBudgets(configFolderContents);
            await this.getExistingSpendeeExports(configFolderContents);
        },
        async getExistingBudgets(saveDirectoryContent: string[]) {
            const isBudget = (filePath: string): filePath is string => BudgetInfoValidator.IsBudget(filePath);
            const parseBudgetInfo = (filePath: string): IBudgetInfo => BudgetInfoMapper.fromFilePath(filePath);

            this.budgets = saveDirectoryContent
                .filter<string>(isBudget)
                .map<IBudgetInfo>(parseBudgetInfo);
        },
        async getExistingSpendeeExports(saveDirectoryContent: string[]) {
            const isExport = (filePath: string): filePath is string => SpendeeParserModule.checkFileIsExport(filePath);
            const getExportName = (filePath: string): string => SpendeeParserModule.getExportNameFromFileName(filePath);
            const parseExportInfo = (fileName: string): ISpendeeExportInfo => SpendeeParserModule.parseExportInfoFromFileName(fileName);

            this.spendeeExports = saveDirectoryContent
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