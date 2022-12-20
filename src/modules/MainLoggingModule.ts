import {createLogger, format, Logger, LoggerOptions, transports} from "winston";
import MainLoggingLevel from "../models/MainLoggingLevel";

class MainLoggingModule {
    private logger: Logger;

    constructor() {
        const loggerOptions = MainLoggingModule.getOptions();
        this.logger = createLogger(loggerOptions);
        this.addConsoleIfNotProduction();
    }

    log(level: MainLoggingLevel, locationName: string, message: string) {
        this.logger.log(level, `${locationName} - ${message}`);
    }

    logInfo(locationName: string, message: string) {
        this.log(MainLoggingLevel.INFO, locationName, message);
    }

    logWarning(locationName: string, message: string) {
        this.log(MainLoggingLevel.WARNING, locationName, message);
    }

    logError(locationName: string, message: string) {
        this.log(MainLoggingLevel.ERROR, locationName, message);
    }

    private addConsoleIfNotProduction() {
        const consoleTransport = new transports.Console({
            format: format.timestamp()
        });
        
        this.logger.add(consoleTransport)
    }

    private static getOptions(): LoggerOptions {
        return {
            level: "info",
            format: format.combine(format.json(), format.timestamp()),
//            transports: [
//                new transports.File({ filename: constants.LOG_FILE_NAME })
//            ]
        }
    }
}

export default new MainLoggingModule();