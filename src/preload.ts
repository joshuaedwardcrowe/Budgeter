import { contextBridge } from "electron";
import RendererFileModule from "./modules/RendererIpcFileModule";
import RendererDirectoryModule from "./modules/RendererIpcDirectoryModule";

// TODO: Handle error responses with Promise.race?
contextBridge.exposeInMainWorld("controllers", {
    storage: {
        askToPromptForFilePath: RendererFileModule.askToPromptForFilePath.bind(RendererFileModule),
        resolvePromptedForFilePath: RendererFileModule.resolvePromptedForFilePath.bind(RendererFileModule),
        askForHomeDirectoryPath: RendererDirectoryModule.askForHomeDirectoryPath.bind(RendererDirectoryModule),
        resolveHomeDirectoryPath: RendererDirectoryModule.resolveHomeDirectoryPath.bind(RendererDirectoryModule),
        askForDirectoryContent: RendererDirectoryModule.askForDirectoryContent.bind(RendererDirectoryModule),
        resolveDirectoryContent: RendererDirectoryModule.resolveDirectoryContent.bind(RendererDirectoryModule),
        askForFileContent: RendererFileModule.askForFileContent.bind(RendererFileModule),
        resolveFileContent: RendererFileModule.resolveFileContent.bind(RendererFileModule),
        askForFileCreation: RendererFileModule.askForFileCreation.bind(RendererFileModule),
        waitForFileCreation: RendererFileModule.waitForFileCreation.bind(RendererFileModule)
    }
});