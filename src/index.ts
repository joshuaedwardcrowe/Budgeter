import { app, ipcMain } from 'electron';
import * as constants from "./constants";
import AppReadyBehavior from "./behaviors/AppReadyBehavior";
import WindowAllClosedBehavior from "./behaviors/WindowAllClosedBehavior";
import AppActivateBehavior from "./behaviors/AppActivateBehavior";
import FilePathRequestBehavior from "./behaviors/FilePathRequestBehavior";
import HomeDirectoryPathRequestBehavior from "./behaviors/HomeDirectoryPathRequestBehavior";
import FileContentRequestBehavior from "./behaviors/FileContentRequestBehavior";


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

app.on(constants.APP_READY_EVENT, AppReadyBehavior);
app.on(constants.APP_WINDOW_ALL_CLOSED, WindowAllClosedBehavior);
app.on(constants.APP_ACTIVATE, AppActivateBehavior)

ipcMain.on(constants.IPC_PROMPT_FILE_PATH_REQUEST, (_, m) => FilePathRequestBehavior(m));
ipcMain.on(constants.IPC_HOME_DIRECTORY_PATH_REQUEST, () => HomeDirectoryPathRequestBehavior())
ipcMain.on(constants.IPC_FILE_CONTENT_REQUEST, (_, m) => FileContentRequestBehavior(m));

console.log("App Ready");