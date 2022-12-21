export default interface ISpendeeExport {
    date: Date,
    wallet: string,
    type: string,
    categoryName: string,
    amount: number,
    currency: string,
    note: string,
    labels: string[],
    author: string
}