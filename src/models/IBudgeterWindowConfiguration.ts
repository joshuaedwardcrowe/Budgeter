import IBudgeterWindowConfigurationWebPreferences from "./IBudgeterWindowConfigurationWebPreferences";
import IpcSource from "./IpcSource";

export default interface IBudgeterWindowConfiguration {
    title: IpcSource,
    height: number,
    width: number,
    show: boolean,
    webPreferences: IBudgeterWindowConfigurationWebPreferences
}