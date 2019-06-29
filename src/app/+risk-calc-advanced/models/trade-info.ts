import { ETradeType } from '@z-brain/calc';

interface RiskRate {
  risk: number;
  profit: number;
}

interface TradeSum {
  baseSum: number;
  quotedSum: number;
}

export interface TradeInfo {
  tradeSum: TradeSum;
  leverage: number;
  breakeven: number;
  riskRate: RiskRate;
  tradeType: ETradeType;
  entryPrice: number;
  stopPrice: number;
  takePrice: number;
}
