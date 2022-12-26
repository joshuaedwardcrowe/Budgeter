import IBudgeterWindowConfiguration from "./IBudgeterWindowConfiguration";

export default class BudgeterConfiguration {
    windows: IBudgeterWindowConfiguration[];

    public constructor(windows: IBudgeterWindowConfiguration[]) {
        this.windows = windows;
    }
}