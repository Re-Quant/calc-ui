import { TypeFee } from './fee';
import { ETradeType } from './trade-type.enum';

export interface Order {
  price: number;
  percent: number;
  typeOfFee: TypeFee;
}

export interface RiskIncomeData {
  entryPrice: Order[];
  stopPrice: Order[];
  takePrice: Order[];

  deposit: number;
  risk: number;

  leverageAvailable: boolean;
  feeEnabled: boolean;

  marketMakerFee: number;
  marketTakerFee: number;

  tradeType: ETradeType;
}

export interface OrderFormData {
  price: string;
  percent: string;
  percentRange: string;
  typeOfFee: TypeFee;
}

export interface RiskIncomeFormData {
  entryPrice: Order[];
  stopPrice: Order[];
  takePrice: Order[];

  deposit: string;
  risk: string;

  leverageAvailable: boolean;
  feeEnabled: boolean;

  marketMakerFee: string;
  marketTakerFee: string;

  tradeType: ETradeType;
}
