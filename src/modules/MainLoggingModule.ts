import { createLogger, format, transports, Logger, LoggerOptions } from "winston";
import MainLoggingLevel from "../models/MainLoggingLevel";
import * as constants from "../constants";
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

    private addConsoleIfNotProduction() {
        const consoleTransport = new transports.Console({
            format: format.simple()
        });
        
        this.logger.add(consoleTransport)
    }

    private static getOptions(): LoggerOptions {
        return {
            level: "info",
            format: format.json(),
            transports: [
                new transports.File({ filename: constants.LOG_FILE_NAME })
            ]
        }
    }
}

export default new MainLoggingModule();