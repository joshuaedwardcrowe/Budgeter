import WindowModule from "../../modules/WindowModule";
import MainLoggingModule from "../../modules/MainLoggingModule";
import AppReadyBehavior from "./AppReadyBehavior";

// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
export default async function (load: string, preload: string) {
    MainLoggingModule.logInfo("AppActivateBehavior", "App Activated");

    if (!WindowModule.anyWindows()) {
        MainLoggingModule.logInfo("AppActivateBehavior", "No Windows, Deferring to AppReadyBehavior");

        await AppReadyBehavior(load, preload);
    }
}