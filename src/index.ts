import { app, ipcMain } from 'electron';
import * as constants from "./constants";
import AppReadyBehavior from "./behaviors/app/AppReadyBehavior";
import WindowAllClosedBehavior from "./behaviors/window/WindowAllClosedBehavior";
import AppActivateBehavior from "./behaviors/app/AppActivateBehavior";
import FilePathRequestBehavior from "./behaviors/file/FilePathRequestBehavior";
import HomeDirectoryPathRequestBehavior from "./behaviors/directory/HomeDirectoryPathRequestBehavior";
import FileContentRequestBehavior from "./behaviors/file/FileContentRequestBehavior";
import FileCreationRequestBehavior from "./behaviors/file/FileCreationRequestBehavior";
import DirectoryContentRequestBehavior from "./behaviors/directory/DirectoryContentRequestBehavior";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

app.on(constants.APP_READY_EVENT, AppReadyBehavior);
app.on(constants.APP_WINDOW_ALL_CLOSED, WindowAllClosedBehavior);
app.on(constants.APP_ACTIVATE, AppActivateBehavior)

ipcMain.on(constants.IPC_PROMPT_FILE_PATH_REQUEST, (_, request) => FilePathRequestBehavior(request));
ipcMain.on(constants.IPC_HOME_DIRECTORY_PATH_REQUEST, () => HomeDirectoryPathRequestBehavior())
ipcMain.on(constants.IPC_FILE_CONTENT_REQUEST, (_, request) => FileContentRequestBehavior(request));
ipcMain.on(constants.IPC_FILE_CREATION_REQUEST, (_, request) => FileCreationRequestBehavior(request));
ipcMain.on(constants.IPC_DIRECTORY_CONTENT_REQUEST, (_, request) => DirectoryContentRequestBehavior(request));

console.log("App Ready");