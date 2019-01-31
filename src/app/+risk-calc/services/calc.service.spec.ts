import { CalcService } from './calc.service';
import { ETradeType, IUniversalFee } from '../models';

describe('CalcService', () => {
    let calc: CalcService;

    beforeEach(() => {
        calc = new CalcService();
    });

    it('should create instance', () => {
        expect(calc).toBeTruthy();
    });

    describe('getDepositDiffAfterTrade', () => {
        it('should calculate deposit diff for Long trade and take price bigger then start price', () => {
            // arrange
            const tradeType: ETradeType = ETradeType.Long;
            const fee: IUniversalFee = { entryFee: 0.002, exitFee: 0.003 };
            const data = {
                tradeType,
                fee,
                startPrice: 1000,
                stopPrice: 800,
                takePrice: 1600,
                deposit: 10000,
                orderDeposit: 5000,
            };
            const ratio = 1 + (data.takePrice - data.startPrice) / data.startPrice;
            const expectedMoneyDiff = data.orderDeposit * ratio
                                    - data.orderDeposit
                                    - data.orderDeposit * fee.entryFee
                                    - data.orderDeposit * ratio * fee.exitFee
            ;
            const expecetdDepositRatio = expectedMoneyDiff / data.deposit;

            // act
            const res = calc.getDepositDiffAfterTrade(data);

            // assert
            expect(res.money).toBe(expectedMoneyDiff);
            expect(res.percent).toBe(expecetdDepositRatio);
        });

        it('should calculate deposit diff for Long trade and take price equal stop price', () => {
            // arrange
            const tradeType: ETradeType = ETradeType.Long;
            const fee: IUniversalFee = { entryFee: 0.002, exitFee: 0.003 };
            const data = {
                tradeType,
                fee,
                startPrice: 1000,
                stopPrice: 800,
                takePrice: 800,
                deposit: 10000,
                orderDeposit: 5000,
            };
            const ratio = 1 + (data.takePrice - data.startPrice) / data.startPrice;
            const expectedMoneyDiff = data.orderDeposit * ratio
                - data.orderDeposit
                - data.orderDeposit * fee.entryFee
                - data.orderDeposit * ratio * fee.exitFee
            ;
            const expecetdDepositRatio = expectedMoneyDiff / data.deposit;

            // act
            const res = calc.getDepositDiffAfterTrade(data);

            // assert
            expect(res.money).toBe(expectedMoneyDiff);
            expect(res.percent).toBe(expecetdDepositRatio);
        });

        it('should calculate deposit diff for Short trade and take price bigger then start price', () => {
            // arrange
            const tradeType: ETradeType = ETradeType.Short;
            const fee: IUniversalFee = { entryFee: 0.003, exitFee: 0.002 };
            const data = {
                tradeType,
                fee,
                startPrice: 1000,
                stopPrice: 800,
                takePrice: 1600,
                deposit: 10000,
                orderDeposit: 5000,
            };
            const ratio = 1 - (data.takePrice - data.startPrice) / data.startPrice;
            const expectedMoneyDiff = data.orderDeposit * ratio
                - data.orderDeposit
                - data.orderDeposit * fee.entryFee
                - data.orderDeposit * ratio * fee.exitFee
            ;
            const expectedDepositRatio = expectedMoneyDiff / data.deposit;

            // act
            const res = calc.getDepositDiffAfterTrade(data);

            // assert
            expect(res.money).toBe(expectedMoneyDiff);
            expect(res.percent).toBe(expectedDepositRatio);
        });

        it('should calculate deposit diff for Short trade and take price equal stop price', () => {
            // arrange
            const tradeType: ETradeType = ETradeType.Short;
            const fee: IUniversalFee = { entryFee: 0.003, exitFee: 0.002 };
            const data = {
                tradeType,
                fee,
                startPrice: 1000,
                stopPrice: 800,
                takePrice: 800,
                deposit: 10000,
                orderDeposit: 5000,
            };
            const ratio = 1 - (data.takePrice - data.startPrice) / data.startPrice;
            const expectedMoneyDiff = data.orderDeposit * ratio
                - data.orderDeposit
                - data.orderDeposit * fee.entryFee
                - data.orderDeposit * ratio * fee.exitFee
            ;
            const expecetdDepositRatio = expectedMoneyDiff / data.deposit;

            // act
            const res = calc.getDepositDiffAfterTrade(data);

            // assert
            expect(res.money).toBe(expectedMoneyDiff);
            expect(res.percent).toBe(expecetdDepositRatio);
        });
    });

    describe('getTakeAndStopAbsDiffRatio', () => {
        it('should calculate ratio for Long trade', () => {
            // arrange
            const data = { startPrice: 1000, stopPrice: 800, takePrice: 1600 };
            // act
            const res = calc.getTakeAndStopAbsDiffRatio(data);
            // assert
            expect(res).toBe(3);
        });
        it('should calculate ratio for Short trade', () => {
            // arrange
            const data = { startPrice: 1000, stopPrice: 1200, takePrice: 200 };
            // act
            const res = calc.getTakeAndStopAbsDiffRatio(data);
            // assert
            expect(res).toBe(4);
        });
    });

    describe('getTakePriceAbsDiff', () => {
        it('should return positive result for Long trade', () => {
            // arrange
            const data = { startPrice: 1000, takePrice: 1600 };
            // act
            const res = calc.getTakePriceAbsDiff(data);
            // assert
            expect(res).toBe(600);
        });
        it('should return positive result for Short trade', () => {
            // arrange
            const data = { startPrice: 1000, takePrice: 600 };
            // act
            const res = calc.getTakePriceAbsDiff(data);
            // assert
            expect(res).toBe(400);
        });
    });

    describe('getStopPriceAbsDiff', () => {
        it('should return positive result for Long trade', () => {
            // arrange
            const data = { startPrice: 1000, stopPrice: 600 };
            // act
            const res = calc.getStopPriceAbsDiff(data);
            // assert
            expect(res).toBe(400);
        });
        it('should return positive result for Short trade', () => {
            // arrange
            const data = { startPrice: 1000, stopPrice: 1400 };
            // act
            const res = calc.getStopPriceAbsDiff(data);
            // assert
            expect(res).toBe(400);
        });
    });

    describe('getTradePriceDiffRatio', () => {
        it('should return positive result for Long trade and price increase', () => {
            // arrange
            const data = { tradeType: ETradeType.Long, startPrice: 1000, takePrice: 1500 };
            // act
            const res = calc.getTradePriceDiffRatio(data);
            // assert
            expect(res).toBe(0.5);
        });
        it('should return negative result for Long trade and price decrease', () => {
            // arrange
            const data = { tradeType: ETradeType.Long, startPrice: 1000, takePrice: 500 };
            // act
            const res = calc.getTradePriceDiffRatio(data);
            // assert
            expect(res).toBe(-0.5);
        });
        it('should return negative result for Short trade and price decrease', () => {
            // arrange
            const data = { tradeType: ETradeType.Short, startPrice: 1000, takePrice: 500 };
            // act
            const res = calc.getTradePriceDiffRatio(data);
            // assert
            expect(res).toBe(0.5);
        });
        it('should return positive result for Short trade and price increase', () => {
            // arrange
            const data = { tradeType: ETradeType.Short, startPrice: 1000, takePrice: 1500 };
            // act
            const res = calc.getTradePriceDiffRatio(data);
            // assert
            expect(res).toBe(-0.5);
        });
    });

    describe('getTradePriceDiff', () => {
        it('should return positive result for Long trade and price increase', () => {
            // arrange
            const data = { tradeType: ETradeType.Long, startPrice: 1000, takePrice: 1100 };
            // act
            const res = calc.getTakePriceDiff(data);
            // assert
            expect(res).toBe(1100 - 1000);
        });
        it('should return negative result for Long trade and price decrease', () => {
            // arrange
            const data = { tradeType: ETradeType.Long, startPrice: 1000, takePrice: 900 };
            // act
            const res = calc.getTakePriceDiff(data);
            // assert
            expect(res).toBe(900 - 1000);
        });
        it('should return negative result for Short trade and price decrease', () => {
            // arrange
            const data = { tradeType: ETradeType.Short, startPrice: 1000, takePrice: 900 };
            // act
            const res = calc.getTakePriceDiff(data);
            // assert
            expect(res).toBe(1000 - 900);
        });
        it('should return positive result for Short trade and price increase', () => {
            // arrange
            const data = { tradeType: ETradeType.Short, startPrice: 1000, takePrice: 1100 };
            // act
            const res = calc.getTakePriceDiff(data);
            // assert
            expect(res).toBe(1000 - 1100);
        });
    });

    describe('signToTradeType', () => {
        it('should convert 1 or bigger to Long', () => {
            expect(calc.signToTradeType(1)).toBe(ETradeType.Long);
            expect(calc.signToTradeType(100)).toBe(ETradeType.Long);
            expect(calc.signToTradeType(+Infinity)).toBe(ETradeType.Long);
        });
        it('should convert 0 to Long', () => {
            expect(calc.signToTradeType(0)).toBe(ETradeType.Long);
        });
        it('should convert -1 or less to Short', () => {
            expect(calc.signToTradeType(-1)).toBe(ETradeType.Short);
            expect(calc.signToTradeType(-100)).toBe(ETradeType.Short);
            expect(calc.signToTradeType(-Infinity)).toBe(ETradeType.Short);
        });
    });

    describe('tradeTypeToSign', () => {
        it('should convert Long to 1', () => {
            expect(calc.tradeTypeToSign({ tradeType: ETradeType.Long })).toBe(1);
        });
        it('should convert Short to -1', () => {
            expect(calc.tradeTypeToSign({ tradeType: ETradeType.Short })).toBe(-1);
        });
    });

    describe('getBreakevenPrice', () => {
        it('should calculate breakeven price for a Long trade', () => {
            // arrange
            const buyFee = 0.002;
            const sellFee = 0.003;
            /** Long trade fee */
            const fee: IUniversalFee = { entryFee: buyFee, exitFee: sellFee };
            const startPrice = 1000;
            const tradeDeposit = 1000000;

            // act
            const breakevenPrice = calc.getBreakevenPrice(startPrice, fee);

            // assert
            const btc = tradeDeposit / startPrice;
            const resultDeposit = btc * breakevenPrice;
            const entryFee = tradeDeposit * fee.entryFee;
            const exitFee = resultDeposit * fee.exitFee;
            const res = resultDeposit - entryFee - exitFee;

            expect(res.toFixed(5)).toBe(tradeDeposit.toFixed(5));
        });

        it('should calculate breakeven price for a Short trade', () => {
            // arrange
            const buyFee = 0.002;
            const sellFee = 0.003;
            /** Short trade fee */
            const fee: IUniversalFee = { entryFee: sellFee, exitFee: buyFee };
            const startPrice = 1000;
            const tradeDeposit = 1000000;

            // act
            const breakevenPrice = calc.getBreakevenPrice(startPrice, fee);

            // assert
            const btc = tradeDeposit / startPrice;
            const resultDeposit = btc * breakevenPrice;
            const entryFee = tradeDeposit * fee.entryFee;
            const exitFee = resultDeposit * fee.exitFee;
            const res = resultDeposit - entryFee - exitFee;

            expect(res.toFixed(5)).toBe(tradeDeposit.toFixed(5));
        });
    });

    describe('getUniversalFee', () => {
        it('should handle Long trade', () => {
            // arrange
            const data = { buyFee: 0.002, sellFee: 0.003, tradeType: ETradeType.Long };
            const expected: IUniversalFee = { entryFee: data.buyFee, exitFee: data.sellFee };
            // act
            const res = calc.getUniversalFee(data);
            // assert
            expect(res).toEqual(expected);
        });

        it('should handle Short trade', () => {
            // arrange
            const data = { buyFee: 0.002, sellFee: 0.003, tradeType: ETradeType.Short };
            const expected: IUniversalFee = { entryFee: data.sellFee, exitFee: data.buyFee };
            // act
            const res = calc.getUniversalFee(data);
            // assert
            expect(res).toEqual(expected);
        });
    });

    describe('getTradeTypeByStartStop', () => {
        it('should return Long for "start" bigger "stop"', () => {
            // arrange
            const data = { startPrice: 1000, stopPrice: 900 };
            // act
            const tradeType = calc.getTradeTypeByStartStop(data);
            // assert
            expect(tradeType).toBe(ETradeType.Long);
        });

        it('should return Long for "start" equal "stop"', () => {
            // arrange
            const data = { startPrice: 1000, stopPrice: 1000 };
            // act
            const tradeType = calc.getTradeTypeByStartStop(data);
            // assert
            expect(tradeType).toBe(ETradeType.Long);
        });

        it('should return Short for "start" less "stop"', () => {
            // arrange
            const data = { startPrice: 1000, stopPrice: 1100 };
            // act
            const tradeType = calc.getTradeTypeByStartStop(data);
            // assert
            expect(tradeType).toBe(ETradeType.Short);
        });
    });

    describe('getTradeTypeByStartTake', () => {
        it('should return Long for "start" less "take"', () => {
            // arrange
            const data = { startPrice: 1000, takePrice: 1100 };
            // act
            const tradeType = calc.getTradeTypeByStartTake(data);
            // assert
            expect(tradeType).toBe(ETradeType.Long);
        });

        it('should return Long for "start" equal "take"', () => {
            // arrange
            const data = { startPrice: 1000, takePrice: 1000 };
            // act
            const tradeType = calc.getTradeTypeByStartTake(data);
            // assert
            expect(tradeType).toBe(ETradeType.Long);
        });

        it('should return Short for "start" bigger "take"', () => {
            // arrange
            const data = { startPrice: 1100, takePrice: 1000 };
            // act
            const tradeType = calc.getTradeTypeByStartTake(data);
            // assert
            expect(tradeType).toBe(ETradeType.Short);
        });
    });

});
