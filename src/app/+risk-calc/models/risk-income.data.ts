import { TypeFee } from './fee';

export interface RiskIncomeData {
    startPrice: number;
    stopPrice: number;
    takePrice: number;

    deposit: number;
    risk: number;

    leverageAvailable: boolean;

    orderStartTypeOfFee: TypeFee;
    stopLossTypeOfFee: TypeFee;
    takeProfitPriceTypeOfFee: TypeFee;

    marketMakerFee: number;
    marketTakerFee: number;
}
