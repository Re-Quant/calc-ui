import { PricePoint } from './price-point';
import { ETradeType } from './trade-type.enum';

export interface CalculatedData {
  pricePoints: PricePoint[];

  takePricePoint: PricePoint;
  breakevenPricePoint: PricePoint;

  /**
   * Part of the deposit for entry to the market
   */
  orderDeposit: number;
  tradeType: ETradeType;

  /**
   * Starts from 1. If `deposit` <= `orderDeposit` leverage equals 1, otherwise it bigger then 1.
   */
  leverage: number;
}

