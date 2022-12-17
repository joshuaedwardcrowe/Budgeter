import fs from 'fs/promises';

const TEXT_ENCODING = "utf8";

class StorageModule {
    public static checkFolderExists(folderPath: string): Promise<boolean> {
        return this._checkFileSystemObjectExists(folderPath);
    }

    public static async checkFileExists(filePath: string): Promise<boolean> {
        return this._checkFileSystemObjectExists(filePath);
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

    private static async _checkFileSystemObjectExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default StorageModule;