import { ETradeType } from '@z-brain/calc';

export enum TypeFee {
  marketMaker = 'marketMakerFee',
  marketTaker = 'marketTakerFee',
}

export interface OrderFormData {
  activeOrder: boolean;
  price: string;
  percent: string;
  typeOfFee: TypeFee;
}

export interface CommonFormData {
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

export interface TradeFormData {
  common: CommonFormData;
  entries: OrderFormData[];
  stops: OrderFormData[];
  takes: OrderFormData[];
}
