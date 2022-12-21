import { contextBridge } from "electron";
import RendererFileModule from "./modules/RendererIpcFileModule";
import RendererDirectoryModule from "./modules/RendererIpcDirectoryModule";

// TODO: Handle error responses with Promise.race?
contextBridge.exposeInMainWorld("controllers", {
    storage: {
        promptForFilePath: RendererFileModule.askToPromptForFilePath.bind(RendererFileModule),
        waitForPromptedForFilePath: RendererFileModule.prepareForPromptedFilePath.bind(RendererFileModule),
        askForHomeDirectoryPath: RendererDirectoryModule.askForHomeDirectoryPath.bind(RendererDirectoryModule),
        waitForHomeDirectoryPath: RendererDirectoryModule.prepareForHomeDirectoryPath.bind(RendererDirectoryModule),
        askForDirectoryContent: RendererDirectoryModule.askForDirectoryContent.bind(RendererDirectoryModule),
        waitForDirectoryContent: RendererDirectoryModule.prepareForDirectoryContent.bind(RendererDirectoryModule),
        askForFileContent: RendererFileModule.askForFileContent.bind(RendererFileModule),
        waitForFileContent: RendererFileModule.prepareForFileContent.bind(RendererFileModule),
        askForFileCreation: RendererFileModule.askForFileCreation.bind(RendererFileModule),
        waitForFileCreation: RendererFileModule.prepareForFileCreation.bind(RendererFileModule)
    }
});