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
  marketMaker = 'marketMakerFee',
  marketTaker = 'marketTakerFee',
}

export enum ExitTypeOfFee {
  stopLoss = 'stopLoss',
  takeProfit = 'takeProfit',
}
