import fs from 'fs/promises';
import os from "os";

const TEXT_ENCODING = "utf8";

class StorageModule {

    public static getOperatingSystemHomeDirectoryPath(): string {
        return os.homedir();
    }

    public static async readDirectoryContent(directoryPath: string): Promise<string[]> {
        return fs.readdir(directoryPath);
    }
    public static tryCheckDirectoryExists(directoryPath: string): Promise<boolean> {
        return this._tryCheckFileSystemObjectExists(directoryPath);
    }

    public static async tryCheckFileExists(filePath: string): Promise<boolean> {
        return this._tryCheckFileSystemObjectExists(filePath);
    }

    public static createFolder(folderPath: string): Promise<void> {
        return fs.mkdir(folderPath);
    }

    public static createFile(filePath: string, fileContent: string): Promise<void> {
        return fs.writeFile(filePath, fileContent);
    }

    public static readFile(filePath: string): Promise<string> {
        return fs.readFile(filePath, TEXT_ENCODING);
    }

    public static deleteFile(filePath: string): Promise<void> {
        return fs.unlink(filePath);
    }

    private static async _tryCheckFileSystemObjectExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default StorageModule;