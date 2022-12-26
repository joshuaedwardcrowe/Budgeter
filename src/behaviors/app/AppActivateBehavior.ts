import WindowModule from "../../modules/WindowModule";
import MainLoggingModule from "../../modules/logging/MainLoggingModule";
import AppReadyBehavior from "./AppReadyBehavior";
import IpcSource from "../../models/IpcSource";

// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
export default async function AppActivateBehavior(load: string, preload: string) {
    MainLoggingModule.logDebug(IpcSource.Main, AppActivateBehavior.name, "App Activated");

    if (!WindowModule.anyWindows()) {
        MainLoggingModule.logInfo(IpcSource.Main, AppActivateBehavior.name, `No Windows, Deferring to ${AppReadyBehavior.name}`);

        await AppReadyBehavior(load, preload);
    }
}