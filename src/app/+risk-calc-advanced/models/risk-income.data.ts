import { TypeFee } from './fee';
import { ETradeType } from '@z-brain/calc';

export interface Order {
  price: number;
  percent: number;
  typeOfFee: TypeFee;
}

export interface RiskIncomeData {
  entries: Order[];
  stopLosses: Order[];
  takeProfits: Order[];

  deposit: number;
  risk: number;

  leverageAvailable: boolean;
  maxLeverage: number;
  feeEnabled: boolean;

  marketMakerFee: number;
  marketTakerFee: number;

  maxTradeSum: number;

  tradeType: ETradeType;
}

export interface OrderFormData {
  price: string;
  percent: string;
  typeOfFee: TypeFee;
}

export interface OrderFormData {
  activeOrder: boolean;
  price: string;
  percent: string;
  typeOfFee: TypeFee;
}

export interface RiskIncomeFormData {
  entries: OrderFormData[];
  stopLosses: OrderFormData[];
  takeProfits: OrderFormData[];

  deposit: string;
  risk: string;

  leverageAvailable: boolean;
  maxLeverage: string;
  feeEnabled: boolean;

  marketMakerFee: string;
  marketTakerFee: string;

  maxTradeSum: string;

  tradeType: ETradeType;
}
