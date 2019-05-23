import { TypeFee } from './fee';
import { ETradeType } from './trade-type.enum';

export interface RiskIncomeData {
  tradeType: ETradeType;

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
