import {app, ipcMain} from 'electron';
import MainLoggingModule from "./modules/logging/MainLoggingModule";
import MainIpcModule from "./modules/ipc/MainIpcModule";
import AppReadyBehavior from "./behaviors/app/AppReadyBehavior";
import WindowAllClosedBehavior from "./behaviors/window/WindowAllClosedBehavior";
import AppActivateBehavior from "./behaviors/app/AppActivateBehavior";
import FilePathRequestConsumer from "./consumers/file/FilePathPromptRequestConsumer";
import HomeDirectoryPathRequestConsumer from "./consumers/directory/HomeDirectoryPathRequestConsumer";
import FileContentRequestConsumer from "./consumers/file/FileContentRequestConsumer";
import FileCreationRequestConsumer from "./consumers/file/FileCreationRequestConsumer";
import FileDeletionRequestConsumer from "./consumers/file/FileDeletionRequestConsumer";
import DirectoryContentRequestConsumer from "./consumers/directory/DirectoryContentRequestConsumer";
import SpendeeExportParsingConsumer from "./consumers/parsing/SpendeeExportParsingConsumer";
import * as constants from "./constants";
import IpcKey from "./models/IpcKey";
import IpcStatus from "./models/IpcStatus";
import IpcSource from "./models/IpcSource";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

MainLoggingModule.logInfo(IpcSource.Main,"Index",`Webpack Index Entry Point: ${MAIN_WINDOW_WEBPACK_ENTRY}`);
MainLoggingModule.logInfo(IpcSource.Main, "Index",`Webpack Preload Entry Point: ${MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY}`);

app.on(constants.APP_READY_EVENT, () => AppReadyBehavior(MAIN_WINDOW_WEBPACK_ENTRY, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY));
app.on(constants.APP_ACTIVATE, () => AppActivateBehavior(MAIN_WINDOW_WEBPACK_ENTRY, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY))
app.on(constants.APP_WINDOW_ALL_CLOSED, () => WindowAllClosedBehavior());

MainIpcModule.on(IpcKey.PROMPT_FILE_PATH, FilePathRequestConsumer);
MainIpcModule.on(IpcKey.HOME_DIRECTORY_PATH, HomeDirectoryPathRequestConsumer);
MainIpcModule.on(IpcKey.FILE_CONTENT, FileContentRequestConsumer);
MainIpcModule.on(IpcKey.FILE_CREATION, FileCreationRequestConsumer);
MainIpcModule.on(IpcKey.FILE_DELETION, FileDeletionRequestConsumer);
MainIpcModule.on(IpcKey.DIRECTORY_CONTENT, DirectoryContentRequestConsumer);
MainIpcModule.on(IpcKey.SPENDEE_EXPORT_PARSING, SpendeeExportParsingConsumer);

MainLoggingModule.logInfo(IpcSource.Main, "Index", "IPC Listeners Attached");