import { TypeFee } from './fee';
import { ETradeType } from '@z-brain/calc';

export interface Order {
  activeOrder?: boolean;
  price: number;
  volumePart: number;
  typeOfFee: TypeFee;
}

export interface RiskIncomeData {
  entries: Order[];
  stops: Order[];
  takes: Order[];

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
  activeOrder: boolean;
  price: string;
  percent: string;
  typeOfFee: TypeFee;
}

export interface CommonRiskFormData {
  deposit: string;
  risk: string;
  leverageAvailable: boolean;
  maxLeverage: string;
  feeEnabled: boolean;

  marketMakerFee: string;
  marketTakerFee: string;

  maxTradeVolumeQuoted: string;

  tradeType: ETradeType;
  breakevenOrderType: TypeFee;
}

export interface RiskIncomeFormData {
  commonPanel: CommonRiskFormData;
  entries: OrderFormData[];
  stops: OrderFormData[];
  takes: OrderFormData[];
}
