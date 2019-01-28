import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { CalculatedData, DepositDiff, EPricePointType, ETradeType, IUniversalFee, PricePoint, RiskIncomeData } from '../models';

interface IDepositPercentOpts {
    risk: number;
    startPrice: number;
    stopPrice: number;
    fee: IUniversalFee;
    leverageAvailable: boolean;
}

interface IMoneyDiffOpts {
    /**
     * The diff will be calculated for the price
     */
    price: number;
    /**
     * Deposit for this trade(can be different of full deposit)
     */
    orderDeposit: number;
    deposit: number;
    startPrice: number;
    stopPrice: number;
    buyFee: number;
    sellFee: number;
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

    public constructor(
    ) {
        this.data$ = this.incomeData$.pipe(
            map(data => this.calculateTrade(data)),
            shareReplay(1),
        );
    }

    public updateData(data: RiskIncomeData): void {
        this.incomeData$.next(data);
    }

    private calculateTrade(income: RiskIncomeData): CalculatedData {
        const tradeType = this.getTradeTypeByStartStop(income.startPrice, income.stopPrice);
        const sign = this.tradeTypeToSign(tradeType);

        const stopPriceDiff = Math.abs(income.startPrice - income.stopPrice);
        const takePriceDiff = Math.abs(income.startPrice - income.takePrice);
        const ratio         = takePriceDiff / stopPriceDiff;

        let pricePointsQuantity = Math.ceil(ratio)
            + this.pricesSpread[EPricePointType.Start]
            + this.pricesSpread[EPricePointType.Stop]
            + 1 /* ending price after all 'price parts' */;
        if (pricePointsQuantity < this.minPricePointsQuantity) {
            pricePointsQuantity = this.minPricePointsQuantity;
        }

        const fee = this.getUniversalFee(tradeType, income.buyFee, income.sellFee);
        const depositPercent = this.getDepositPercentToTrade({
            fee,
            risk:              income.risk,
            startPrice:        income.startPrice,
            stopPrice:         income.stopPrice,
            leverageAvailable: income.leverageAvailable,
        });
        const orderDeposit   = income.deposit * depositPercent;

        const pricePoints: PricePoint[] = Array(pricePointsQuantity)
            .fill(1)
            .map((v, i): PricePoint => {
                const price = income.stopPrice + sign * stopPriceDiff * i;
                return this.getPricePoint({
                    price,
                    orderDeposit: orderDeposit,
                    buyFee:       income.buyFee,
                    sellFee:      income.sellFee,
                    startPrice:   income.startPrice,
                    stopPrice:    income.stopPrice,
                    deposit:      income.deposit,
                });
            })
            .reverse();

        const takePricePoint = this.getPricePoint({
            orderDeposit,
            buyFee:       income.buyFee,
            sellFee:      income.sellFee,
            price:        income.takePrice,
            startPrice:   income.startPrice,
            stopPrice:    income.stopPrice,
            deposit:      income.deposit,
        });
        const leverage = (orderDeposit / income.deposit > 1) ? orderDeposit / income.deposit : 1;

        return {
            tradeType,
            pricePoints,
            orderDeposit,
            takePricePoint,
            leverage,
            breakevenPricePoint: {} as any,
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

        return i < stopEnd     ? EPricePointType.Stop        :
               i === start     ? EPricePointType.Start       :
               i < badTakeEnd  ? EPricePointType.BadTake     :
               i < goodTakeEnd ? EPricePointType.GoodTake    :
               EPricePointType.AmazingTake ;
    }


    private getDepositPercentToTrade(
        {
            leverageAvailable,
            risk: r,
            startPrice: s,
            stopPrice: l,
            fee,
        }: IDepositPercentOpts,
    ): number {
        const p = Math.abs(s - l) / s;
        const res = r / (p + fee.entryFee + (1 - p) * fee.exitFee);

        return !leverageAvailable && res > 1 ? 1 : res;
    }

    private getMoneyDiff(o: IMoneyDiffOpts): DepositDiff {
        const isLong = o.startPrice > o.stopPrice;
        const sign = Math.sign(isLong ? o.price - o.startPrice : o.startPrice - o.price);

        const moneyDiff = sign * o.orderDeposit * Math.abs(o.price - o.startPrice) / o.startPrice;

        const entryFee = o.orderDeposit * (isLong ? o.buyFee : o.sellFee);
        const exitFee = (o.orderDeposit + moneyDiff) * (isLong ? o.sellFee : o.buyFee);

        const money = moneyDiff - entryFee - exitFee;

        return {
            money,
            percent: money / o.deposit,
        };
    }

    private getPricePoint(o: IMoneyDiffOpts): PricePoint {
        const diff = this.getMoneyDiff(o);
        const stopPriceDiff = Math.abs(o.startPrice - o.stopPrice);
        const isLong = o.startPrice > o.stopPrice;

        const i = (isLong ? o.price - o.startPrice : o.startPrice - o.price) / stopPriceDiff;

        return {
            diff,
            price: o.price,
            type: this.getPricePointType(i),
            ratio: i,
        };
    }

    public getBreakevenPrice(startPrice: number, { entryFee, exitFee }: IUniversalFee): number {
        return startPrice * (1 + entryFee) / (1 - exitFee);
    }

    public getUniversalFee(type: ETradeType, buyFee: number, sellFee: number): IUniversalFee {
        return type === ETradeType.Long
               ? { entryFee: buyFee, exitFee: sellFee }
               : { entryFee: sellFee, exitFee: buyFee }
            ;
    }

    public signToTradeType(sign: 1 | -1 | number): ETradeType {
        return sign >= 0 ? ETradeType.Long : ETradeType.Short;
    }

    public tradeTypeToSign(type: ETradeType): 1 | -1 {
        return type === ETradeType.Long ? 1 : -1;
    }

    public getTradeTypeByStartStop(startPrice: number, stopPrice: number): ETradeType {
        return startPrice >= stopPrice ? ETradeType.Long : ETradeType.Short;
    }

    public getTradeTypeByStartTake(startPrice: number, takePrice: number): ETradeType {
        return takePrice >= startPrice ? ETradeType.Long : ETradeType.Short;
    }

}
