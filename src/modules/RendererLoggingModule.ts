export default class RendererLoggingModule {

    static logInfo(locationName: string, message: string): void {
        console.log(`INFO: ${locationName} - ${message}`);
    }

    static logWarning(locationName: string, message: string): void {
        console.log(`WARNING: $[locationName} - ${message}`)
    }

    static logError(locationName: string, message: string): void {
        console.log(`ERRPR@ ${locationName} - ${message}`)
    }

    static clear(): void {
        console.clear();
    }
}