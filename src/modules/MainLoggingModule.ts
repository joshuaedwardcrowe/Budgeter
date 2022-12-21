import {createLogger, format, Logger, LoggerOptions, transports} from "winston";
import LoggingLevel from "../models/LoggingLevel";

class MainLoggingModule {
    private logger: Logger;

    constructor() {
        const loggerOptions = MainLoggingModule.getOptions();
        this.logger = createLogger(loggerOptions);
        this.addConsoleIfNotProduction();
    }

    log(level: LoggingLevel, locationName: string, message: string) {
        this.logger.log(level, `${locationName} - ${message}`);
    }

    logInfo(locationName: string, message: string) {
        this.log(LoggingLevel.INFO, locationName, message);
    }

    logWarning(locationName: string, message: string) {
        this.log(LoggingLevel.WARNING, locationName, message);
    }

    logError(locationName: string, message: string) {
        this.log(LoggingLevel.ERROR, locationName, message);
    }

    private addConsoleIfNotProduction() {
        const consoleTransport = new transports.Console({
            format: format.timestamp()
        });
        
        this.logger.add(consoleTransport)
    }

    private static getOptions(): LoggerOptions {
        return {
            levels: {
                "ok": 0,
                "info": 1,
                "warning": 2,
                "error": 3
            },
            format: format.combine(format.json(), format.timestamp()),
//            transports: [
//                new transports.File({ filename: constants.LOG_FILE_NAME })
//            ]
        }
    }
}

export default new MainLoggingModule();