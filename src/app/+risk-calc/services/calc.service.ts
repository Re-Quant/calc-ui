import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import {
  CalculatedData,
  DepositDiff,
  EPricePointType,
  ETradeType,
  ExitTypeOfFee,
  MarketFee,
  OrderFee,
  PricePoint,
  RiskIncomeData,
  TypeFee
} from '../models';

interface IDepositPercentOpts {
  risk: number;
  startPrice: number;
  stopPrice: number;
  fee: OrderFee;
  leverageAvailable: boolean;
}

interface IMoneyDiffOpts {
  startPrice: number;
  stopPrice: number;
  /**
   * The diff will be calculated for the price
   */
  takePrice: number;
  deposit: number;
  /**
   * Deposit for this trade(can be different of full deposit)
   */
  orderDeposit: number;
  fee: OrderFee;
  tradeType: ETradeType;
  exitTypeOfFee: ExitTypeOfFee;
}

@Injectable({
  providedIn: 'root',
})
export class CalcService {

  public data$: Observable<CalculatedData>;

  private incomeData$ = new ReplaySubject<RiskIncomeData>(1);

  private pricesSpread = Object.freeze({
    [EPricePointType.Stop]: 1,
    [EPricePointType.Start]: 0,
    [EPricePointType.BadTake]: 3,
    [EPricePointType.GoodTake]: 2,
    [EPricePointType.AmazingTake]: +Infinity,
  });

  private readonly minPricePointsQuantity = this.pricesSpread[EPricePointType.Stop]
    + this.pricesSpread[EPricePointType.Start]
    + this.pricesSpread[EPricePointType.BadTake]
    + this.pricesSpread[EPricePointType.GoodTake]
    + 1 /* minimal amazing quantity */
    + 1 /* final price after all 'price parts' */;

  public constructor() {
    this.data$ = this.incomeData$.pipe(
      map(data => this.calculateTrade(data)),
      shareReplay(1),
    );
  }

  public updateData(data: RiskIncomeData): void {
    this.incomeData$.next(data);
  }

  private calculateTrade(income: RiskIncomeData): CalculatedData {
    const sign = this.tradeTypeToSign({ tradeType: income.tradeType });

    const stopPriceDiff = this.getStopPriceAbsDiff(income);
    const ratio = this.getTakeAndStopAbsDiffRatio(income);

    let pricePointsQuantity = Math.ceil(ratio)
      + this.pricesSpread[EPricePointType.Start]
      + this.pricesSpread[EPricePointType.Stop]
      + 1 /* ending price after all 'price parts' */;
    if (pricePointsQuantity < this.minPricePointsQuantity) {
      pricePointsQuantity = this.minPricePointsQuantity;
    }

    const fee = this.getOrderFee(income);
    const depositPercent = this.getDepositPercentToTrade({
      fee,
      risk: income.risk,
      startPrice: income.startPrice,
      stopPrice: income.stopPrice,
      leverageAvailable: income.leverageAvailable,
    });
    const orderDeposit = income.deposit * depositPercent;

    const pricePoints: PricePoint[] = Array(pricePointsQuantity)
      .fill(1)
      .map((v, i): PricePoint => {
        const price = income.stopPrice + sign * stopPriceDiff * i;

        return this.getPricePoint({
          orderDeposit,
          fee,
          takePrice: price,
          tradeType: income.tradeType,
          startPrice: income.startPrice,
          stopPrice: income.stopPrice,
          deposit: income.deposit,
          exitTypeOfFee: i === 0 ? ExitTypeOfFee.stopLoss : ExitTypeOfFee.takeProfit,
        });
      })
      .reverse();

    const takePricePoint = this.getPricePoint({
      orderDeposit,
      fee,
      tradeType: income.tradeType,
      takePrice: income.takePrice,
      startPrice: income.startPrice,
      stopPrice: income.stopPrice,
      deposit: income.deposit,
      exitTypeOfFee: ExitTypeOfFee.takeProfit,
    });
    const leverage = (orderDeposit / income.deposit > 1) ? orderDeposit / income.deposit : 1;

    const breakevenPrice = this.getBreakevenPrice(income.startPrice, fee);
    const breakevenPricePoint = this.getPricePoint({
      orderDeposit,
      fee,
      takePrice: breakevenPrice,
      tradeType: income.tradeType,
      startPrice: income.startPrice,
      stopPrice: income.stopPrice,
      deposit: income.deposit,
      exitTypeOfFee: ExitTypeOfFee.takeProfit,
    });

    return {
      pricePoints,
      orderDeposit,
      takePricePoint,
      leverage,
      breakevenPricePoint,
      tradeType: income.tradeType,
    };
  }

  /**
   * @param i Starts from -1
   */
  private getPricePointType(i: number): EPricePointType {
    const init = -1;
    const stopEnd = init + this.pricesSpread[EPricePointType.Stop];
    const start = stopEnd + this.pricesSpread[EPricePointType.Start];
    const badTakeEnd = start + this.pricesSpread[EPricePointType.BadTake];
    const goodTakeEnd = badTakeEnd + this.pricesSpread[EPricePointType.GoodTake];

    return i < stopEnd ? EPricePointType.Stop :
      i === start ? EPricePointType.Start :
        i < badTakeEnd ? EPricePointType.BadTake :
          i < goodTakeEnd ? EPricePointType.GoodTake :
            EPricePointType.AmazingTake;
  }


  private getDepositPercentToTrade(
    o: IDepositPercentOpts,
  ): number {
    const p = this.getStopPriceAbsDiff(o) / o.startPrice;
    const res = o.risk / (p + o.fee.orderStart + (1 - p) * o.fee.stopLoss);

    return !o.leverageAvailable && res > 1 ? 1 : res;
  }

  public getDepositDiffAfterTrade(o: IMoneyDiffOpts): DepositDiff {
    const moneyDiff = o.orderDeposit * this.getTradePriceDiffRatio(o);

    const entryFee = o.orderDeposit * o.fee.orderStart;
    const exitFee = (o.orderDeposit + moneyDiff) * o.fee[o.exitTypeOfFee];

    const money = moneyDiff - entryFee - exitFee;

    return {
      money,
      percent: money / o.deposit,
    };
  }

  private getPricePoint(o: IMoneyDiffOpts): PricePoint {
    const diff = this.getDepositDiffAfterTrade(o);
    const stopPriceDiff = this.getStopPriceAbsDiff(o);

    const i = this.getTakePriceDiff(o) / stopPriceDiff;

    return {
      diff,
      price: o.takePrice,
      type: this.getPricePointType(i),
      ratio: i,
    };
  }

  public getBreakevenPrice(startPrice: number, fee: OrderFee): number {
    return startPrice * (1 + fee.orderStart) / (1 - fee.takeProfit);
  }

  public getMarketFee(
    o: RiskIncomeData,
  ): MarketFee {
    return {
      marketMaker: o.marketMakerFee,
      marketTaker: o.marketTakerFee,
    };
  }

  public getOrderFee(riskData: RiskIncomeData): OrderFee {
    const marketFee = this.getMarketFee(riskData);

    return {
      orderStart: riskData.orderStartTypeOfFee === TypeFee.MarketMakerFee ? marketFee.marketMaker : marketFee.marketTaker,
      stopLoss: riskData.stopLossTypeOfFee === TypeFee.MarketMakerFee ? marketFee.marketMaker : marketFee.marketTaker,
      takeProfit: riskData.takeProfitPriceTypeOfFee === TypeFee.MarketMakerFee ? marketFee.marketMaker : marketFee.marketTaker,
    };
  }

  public getTakeAndStopAbsDiffRatio(
    o: { startPrice: number; stopPrice: number; takePrice: number; },
  ): number {
    return this.getTakePriceAbsDiff(o) / this.getStopPriceAbsDiff(o);
  }

  public getTakePriceAbsDiff(o: { startPrice: number; takePrice: number; }): number {
    return Math.abs(o.startPrice - o.takePrice);
  }

  public getStopPriceAbsDiff(o: { startPrice: number; stopPrice: number; }): number {
    return Math.abs(o.startPrice - o.stopPrice);
  }

  public getTradePriceDiffRatio(o: { tradeType: ETradeType; startPrice: number; takePrice: number }): number {
    return this.getTakePriceDiff(o) / o.startPrice;
  }

  public getTakePriceDiff(o: { tradeType: ETradeType; startPrice: number; takePrice: number }): number {
    return o.tradeType === ETradeType.Long ? o.takePrice - o.startPrice : o.startPrice - o.takePrice;
  }

  public signToTradeType(sign: 1 | -1 | number): ETradeType {
    return sign >= 0 ? ETradeType.Long : ETradeType.Short;
  }

  public tradeTypeToSign(o: { tradeType: ETradeType }): 1 | -1 {
    return o.tradeType === ETradeType.Long ? 1 : -1;
  }

  public getTradeTypeByStartTake(o: { startPrice: number; takePrice: number; }): ETradeType {
    return o.takePrice >= o.startPrice ? ETradeType.Long : ETradeType.Short;
  }
}
