import IWindowWebConfiguration from "./IWindowWebConfiguration";

export default interface IWindowConfiguration {
    title: string,
    indexFile: string,
    height: number,
    width: number,
    webPreferences: IWindowWebConfiguration
}