import { contextBridge } from "electron";
import RendererIpcFileModule from "./modules/RendererIpcFileModule";
import RendererIpcDirectoryModule from "./modules/RendererIpcDirectoryModule";

const askToPromptForFilePath = RendererIpcFileModule.askToPromptForFilePath.bind(RendererIpcFileModule);
const resolvePromptedForFilePath = RendererIpcFileModule.resolvePromptedForFilePath.bind(RendererIpcFileModule);
const askForFileContent = RendererIpcFileModule.askForFileContent.bind(RendererIpcFileModule);
const resolveFileContent = RendererIpcFileModule.resolveFileContent.bind(RendererIpcFileModule);
const askForFileCreation = RendererIpcFileModule.askForFileCreation.bind(RendererIpcFileModule);
const waitForFileCreation = RendererIpcFileModule.waitForFileCreation.bind(RendererIpcFileModule);

const askForHomeDirectoryPath = RendererIpcDirectoryModule.askForHomeDirectoryPath.bind(RendererIpcDirectoryModule);
const resolveHomeDirectoryPath = RendererIpcDirectoryModule.resolveHomeDirectoryPath.bind(RendererIpcDirectoryModule);
const askForDirectoryContent = RendererIpcDirectoryModule.askForDirectoryContent.bind(RendererIpcDirectoryModule);
const resolveDirectoryContent = RendererIpcDirectoryModule.resolveDirectoryContent.bind(RendererIpcDirectoryModule);

contextBridge.exposeInMainWorld("modules", {
    file: {
        // PROMPT_FILE_PATH
        askToPromptForFilePath,
        resolvePromptedForFilePath,

        // FILE_PATH
        askForFileContent,
        resolveFileContent,

        // FILE_CREATION
        askForFileCreation,
        waitForFileCreation
    },
    directory: {
        // HOME_DIRECTORY_PATH
        askForHomeDirectoryPath,
        resolveHomeDirectoryPath,

        // DIRECTORT_CONTENT
        askForDirectoryContent,
        resolveDirectoryContent
    }
});