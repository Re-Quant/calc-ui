import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { CalculatedData, DepositDiff, EPricePointType, ETradeType, PricePoint, RiskIncomeData } from '../models';

interface IDepositPercentOpts {
    risk: number;
    startPrice: number;
    stopPrice: number;
    buyFee: number;
    sellFee: number;
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

interface IPricePointOpts {
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
        const tradeType = income.startPrice > income.stopPrice ? ETradeType.Long : ETradeType.Short;
        /** 1 for long, -1 for short */
        const sign      = Math.sign(income.takePrice - income.startPrice);

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

        const depositPercent = this.getDepositPercentToTrade({
            risk:              income.risk,
            buyFee:            income.buyFee,
            sellFee:           income.sellFee,
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
            orderDeposit: orderDeposit,
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
            buyFee: bf,
            sellFee: sf,
        }: IDepositPercentOpts,
    ): number {
        const isLong = s > l;
        const p = Math.abs(s - l) / s;
        const marketEntryFee = isLong ? bf : sf;
        const marketExitFee = isLong ? sf : bf;
        const res = r / (p + marketEntryFee + (1 - p) * marketExitFee);

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

}
