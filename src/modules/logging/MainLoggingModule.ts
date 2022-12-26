import {createLogger, format, Logger, LoggerOptions, transports} from "winston";
import LoggingLevel from "../../models/LoggingLevel";
import loggingLevel from "../../models/LoggingLevel";

class MainLoggingModule {
    private logger: Logger;

    constructor() {
        const loggerOptions = MainLoggingModule.getOptions();
        this.logger = createLogger(loggerOptions);
    }

    log(level: LoggingLevel, source: string, locationName: string, message: string) {
        this.logger.log(level, `[[${source}]] ${locationName} - ${message}`);
    }

    logDebug(source: string, locationName: string, message: string) {
        this.log(LoggingLevel.DEBUG, source, locationName, message);
    }
    logInfo(source: string, locationName: string, message: string) {
        this.log(LoggingLevel.INFO, source, locationName, message);
    }

    logWarning(source: string, locationName: string, message: string) {
        this.log(LoggingLevel.WARNING, source, locationName, message);
    }

    logError(source: string, locationName: string, message: string) { // TODO: Need to log exceptions too.
        this.log(LoggingLevel.ERROR, source, locationName, message);
    }
    private static getOptions(): LoggerOptions {
        const consoleTransport = new transports.Console({
            level: LoggingLevel.DEBUG,
            format: format.combine(format.colorize(), format.simple())
        })

        return {
            levels: {
                [LoggingLevel.DEBUG]: 3,
                [LoggingLevel.INFO]: 2,
                [loggingLevel.WARNING]: 1,
                [LoggingLevel.ERROR]: 0
            },
            transports: [ consoleTransport ]
        }
    }
}

export default new MainLoggingModule();