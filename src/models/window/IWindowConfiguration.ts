import IWindowWebConfiguration from "./IWindowWebConfiguration";
import IpcSource from "../IpcSource";

export default interface IWindowConfiguration {
    source?: IpcSource;
    title: string;
    show: boolean;
    height: number;
    width: number;
    webPreferences?: IWindowWebConfiguration;
}