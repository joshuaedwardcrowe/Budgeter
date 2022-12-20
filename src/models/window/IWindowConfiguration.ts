import IWindowWebConfiguration from "./IWindowWebConfiguration";

export default interface IWindowConfiguration {
    title: string,
    height: number,
    width: number,
    webPreferences: IWindowWebConfiguration
}