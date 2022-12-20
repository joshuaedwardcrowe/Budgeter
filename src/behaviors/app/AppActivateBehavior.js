import WindowModule from "../../modules/WindowModule";
import AppReadyBehavior from "./AppReadyBehavior";

// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
export default async function () {
    if (!WindowModule.anyWindows()) {
        await AppReadyBehavior();
    }
}