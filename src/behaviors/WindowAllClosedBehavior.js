import { app } from 'electron';
import { ENVIRONMENT_DARWIN_NAME } from "../constants";

//// Quit when all windows are closed, except on macOS. There, it's common
//// for applications and their menu bar to stay active until the user quits
//// explicitly with Cmd + Q.
export default async function () {
    if (process.platform !== ENVIRONMENT_DARWIN_NAME) {
        app.quit();
    }
}