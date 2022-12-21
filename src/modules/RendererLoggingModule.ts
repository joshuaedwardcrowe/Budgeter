import { ROARR, Roarr} from "roarr";

class RendererLoggingModule {

    constructor() {
        ROARR.write = (message: string) => {
            console.log(JSON.parse(message));
        }
    }

    logInfo(locationName: string, message: string): void {
        Roarr.info(`${locationName} - ${message}`);
    }

    logWarning(locationName: string, message: string): void {
        Roarr.warn(`$[locationName} - ${message}`)
    }

    logError(locationName: string, message: string): void {
        Roarr.error(`${locationName} - ${message}`)
    }

    clear(): void {
        console.clear();
    }
}


export default new RendererLoggingModule();