export interface RiskIncomeData {
    startPrice: number;
    stopPrice: number;
    takePrice: number;

    deposit: number;
    risk: number;

    leverageAvailable: boolean;

    buyFee: number;
    sellFee: number;
}
