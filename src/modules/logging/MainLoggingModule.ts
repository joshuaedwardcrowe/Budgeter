import {createLogger, format, Logger, LoggerOptions, transports} from "winston";
import LoggingLevel from "../../models/LoggingLevel";

class MainLoggingModule {
    private logger: Logger;

    constructor() {
        const loggerOptions = MainLoggingModule.getOptions();
        this.logger = createLogger(loggerOptions);
    }

    log(level: LoggingLevel, source: string, locationName: string, message: string) {
        this.logger.log(level, `[[${source}]] ${locationName} - ${message}`);
    }

    // TODO: Need debug at some point.
    logInfo(source: string, locationName: string, message: string) {
        this.log(LoggingLevel.INFO, source, locationName, message);
    }

    logWarning(source: string, locationName: string, message: string) {
        this.log(LoggingLevel.WARNING, source, locationName, message);
    }

    logError(source: string, locationName: string, message: string) {
        this.log(LoggingLevel.ERROR, source, locationName, message);
    }
    private static getOptions(): LoggerOptions {
        const consoleTransport = new transports.Console({
            format: format.combine(format.colorize(), format.simple())
        })

        return {
            level: null,
            levels: {
                "ok": 0,
                "info": 1,
                "warning": 2,
                "error": 3
            },
            transports: [ consoleTransport ]
        }
    }
}

export default new MainLoggingModule();