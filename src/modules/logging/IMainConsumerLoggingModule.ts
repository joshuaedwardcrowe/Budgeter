export default interface IMainConsumerLoggingModule {
    logInfo(message: string): void

    logWarning(message: string): void

    logError(message: string): void;
}
