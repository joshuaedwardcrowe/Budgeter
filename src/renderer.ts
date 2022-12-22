import './index.css';
import {createApp} from "vue";
import SpendeeParserModule from "./modules/SpendeeExportParserModule";
import ISpendeeExportInfo from "./models/ISpendeeExportInfo";
import RendererLoggingModule from "./modules/RendererLoggingModule";
import ITransaction from "./models/transaction/ITransaction";
import BudgetCategoryMapper from "./mappers/BudgetCategoryMapper";
import Budget from "./models/budget/Budget";
import BudgetHistory from "./models/budget/BudgetHistory";
import TransactionType from "./models/transaction/TransactionType";

// TODO: Step 1 is to make the transactions be encapsulated in the budget model.
// TODO: Step 2 is to store the Budget model generated from CSV in a JSON file.


createApp({
    data: () => ({
        currentBudget: null,
        spendeeExports: [],
        homeDirectoryPath: null
    }),
    mounted: async function() { await this.getExistingSpendeeExports(); },
    methods: {
        async createNewBudget(info: ISpendeeExportInfo) {
            const homeDirectoryPath = await this.getHomeDirectoryPath();
            const spendeeExportPath = `${homeDirectoryPath}/${info.fileName}.csv`;

            modules.parsing.askForSpendeeExportParsing(spendeeExportPath);
            const transactions: ITransaction[] = await modules.parsing.resolveSpendeeExportParsing();

            const categories = BudgetCategoryMapper.fromTransactions(transactions);
            const history = new BudgetHistory(categories);

            this.currentBudget = new Budget(history);
            console.log(this.currentBudget);
        },
        async getExistingSpendeeExports() {
            const homeDirectoryPath = await this.getHomeDirectoryPath();

            modules.directory.askForDirectoryContent(homeDirectoryPath);
            RendererLoggingModule.logInfo("getExistingSpendeeExports", `Asking For Directory Content: ${homeDirectoryPath}`);

            const exportSaveDirectoryContent = await modules.directory.resolveDirectoryContent();
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
            modules.file.askToPromptForFilePath("Spendee Export");
            RendererLoggingModule.logInfo("askForSpendeeExport", "Asking For File Path to Spendee Export");

            const filePath = await modules.file.resolvePromptedForFilePath();
            RendererLoggingModule.logInfo("askForSpendeeExport", `Got Spendee Export File Path: ${filePath}`);

            const exportInfo = SpendeeParserModule.parseExportInfoFromFilePath(filePath);

            const homeDirectoryPath = await this.getHomeDirectoryPath();

            // TODO: There must be a way to not put CSV in here and in Export Info FileName instead.
            const exportSaveDirectoryPath = `${homeDirectoryPath}/${exportInfo.fileName}.csv`;

            modules.file.askForFileContent(filePath);
            RendererLoggingModule.logInfo("askForSpendeeExport", `Asked for File Content: ${filePath}`);

            const fileContent = await modules.file.resolveFileContent();
            RendererLoggingModule.logInfo("askForSpendeeExport", `Got File Content: ${filePath}`);

            modules.file.askForFileCreation(exportSaveDirectoryPath, fileContent);
            RendererLoggingModule.logInfo("askForSpendeeExport", `Ask For File Creation: ${exportSaveDirectoryPath}`);

            await modules.file.waitForFileCreation();
            RendererLoggingModule.logInfo("askForSpendeeExport", `File Created: ${exportSaveDirectoryPath}`);

            this.spendeeExports = [exportInfo, ...this.spendeeExports]
        },
        async getHomeDirectoryPath() {
            if (!this.homeDirectoryPath) {
                modules.directory.askForHomeDirectoryPath();
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