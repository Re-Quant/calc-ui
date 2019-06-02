import { ETradeType } from './trade-type.enum';

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
