import WindowModule from "../../modules/WindowModule";
import MainLoggingModule from "../../modules/MainLoggingModule";
import MainLoggingLevel from "../../models/MainLoggingLevel";
import AppReadyBehavior from "./AppReadyBehavior";

// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
export default async function () {
    MainLoggingModule.log(MainLoggingLevel.INFO, "AppActivateBehavior", "App Activated");

    if (!WindowModule.anyWindows()) {
        MainLoggingModule.log(MainLoggingLevel.INFO, "AppActivateBehavior", "No Windows, Deferring to AppReadyBehavior");

        await AppReadyBehavior();
    }
}