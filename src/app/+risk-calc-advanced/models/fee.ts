export interface OrderFee {
  orderStart: number;
  stopLoss: number;
  takeProfit: number;
}

export interface MarketFee {
  marketMaker: number;
  marketTaker: number;
}

export enum TypeFee {
  marketMakerFee = 'marketMakerFee',
  marketTakerFee = 'marketTakerFee',
}

export enum ExitTypeOfFee {
  stopLoss = 'stopLoss',
  takeProfit = 'takeProfit',
}
