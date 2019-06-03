import { TypeFee } from './fee';
import { ETradeType } from './trade-type.enum';

export interface ItemPrice {
  price: number;
  percent: number;
  typeOfFee: TypeFee;
}

export interface RiskIncomeData {
  entryPrice: ItemPrice[];
  stopPrice: ItemPrice[];
  takePrice: ItemPrice[];

  deposit: number;
  risk: number;

  leverageAvailable: boolean;
  feeAvailable: boolean;

  marketMakerFee: number;
  marketTakerFee: number;

  tradeType: ETradeType;
}
