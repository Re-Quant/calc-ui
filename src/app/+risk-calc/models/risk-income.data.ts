export interface RiskIncomeData {
    startPrice: number;
    stopPrice: number;
    takePrice: number;

    deposit: number;
    risk: number;

    leverageAvailable: boolean;

    buyFee: number;
    sellFee: number;

    orderStartTypeOfFee: 'marketMakerFee' | 'marketTakerFee';
    stopLossTypeOfFee: 'marketMakerFee' | 'marketTakerFee';

    marketMakerFee?: number;
    marketTakerFee?: number;
}
