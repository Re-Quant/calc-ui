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

    describe('getTradePriceDiffRatio', () => {
        it('should return positive result for Long trade and price increase', () => {
            expect(calc.getTradePriceDiffRatio(ETradeType.Long, 1000, 1500)).toBe(0.5);
        });
        it('should return negative result for Long trade and price decrease', () => {
            expect(calc.getTradePriceDiffRatio(ETradeType.Long, 1000, 500)).toBe(-0.5);
        });
        it('should return negative result for Short trade and price decrease', () => {
            expect(calc.getTradePriceDiffRatio(ETradeType.Short, 1000, 500)).toBe(0.5);
        });
        it('should return positive result for Short trade and price increase', () => {
            expect(calc.getTradePriceDiffRatio(ETradeType.Short, 1000, 1500)).toBe(-0.5);
        });
    });

    describe('getTradePriceDiff', () => {
        it('should return positive result for Long trade and price increase', () => {
            expect(calc.getTradePriceDiff(ETradeType.Long, 1000, 1100)).toBe(1100 - 1000);
        });
        it('should return negative result for Long trade and price decrease', () => {
            expect(calc.getTradePriceDiff(ETradeType.Long, 1000, 900)).toBe(900 - 1000);
        });
        it('should return negative result for Short trade and price decrease', () => {
            expect(calc.getTradePriceDiff(ETradeType.Short, 1000, 900)).toBe(1000 - 900);
        });
        it('should return positive result for Short trade and price increase', () => {
            expect(calc.getTradePriceDiff(ETradeType.Short, 1000, 1100)).toBe(1000 - 1100);
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
            expect(calc.tradeTypeToSign(ETradeType.Long)).toBe(1);
        });
        it('should convert Short to -1', () => {
            expect(calc.tradeTypeToSign(ETradeType.Short)).toBe(-1);
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
            const buyFee = 0.002;
            const sellFee = 0.003;
            const type = ETradeType.Long;
            const expected: IUniversalFee = { entryFee: buyFee, exitFee: sellFee };

            // act
            const res = calc.getUniversalFee(type, buyFee, sellFee);

            // assert
            expect(res).toEqual(expected);
        });

        it('should handle Short trade', () => {
            // arrange
            const buyFee = 0.002;
            const sellFee = 0.003;
            const type = ETradeType.Short;
            const expected: IUniversalFee = { entryFee: sellFee, exitFee: buyFee };

            // act
            const res = calc.getUniversalFee(type, buyFee, sellFee);

            // assert
            expect(res).toEqual(expected);
        });
    });

    describe('getTradeTypeByStartStop', () => {
        it('should return Long for "start" bigger "stop"', () => {
            // arrange
            const start = 1000;
            const stop = 900;

            // act
            const tradeType = calc.getTradeTypeByStartStop(start, stop);

            // assert
            expect(tradeType).toBe(ETradeType.Long);
        });

        it('should return Long for "start" equal "stop"', () => {
            // arrange
            const start = 1000;
            const stop = 1000;

            // act
            const tradeType = calc.getTradeTypeByStartStop(start, stop);

            // assert
            expect(tradeType).toBe(ETradeType.Long);
        });

        it('should return Short for "start" less "stop"', () => {
            // arrange
            const start = 1000;
            const stop = 1100;

            // act
            const tradeType = calc.getTradeTypeByStartStop(start, stop);

            // assert
            expect(tradeType).toBe(ETradeType.Short);
        });
    });

    describe('getTradeTypeByStartTake', () => {
        it('should return Long for "start" less "take"', () => {
            // arrange
            const start = 1000;
            const take = 1100;

            // act
            const tradeType = calc.getTradeTypeByStartTake(start, take);

            // assert
            expect(tradeType).toBe(ETradeType.Long);
        });

        it('should return Long for "start" equal "take"', () => {
            // arrange
            const start = 1000;
            const take = 1000;

            // act
            const tradeType = calc.getTradeTypeByStartTake(start, take);

            // assert
            expect(tradeType).toBe(ETradeType.Long);
        });

        it('should return Short for "start" bigger "take"', () => {
            // arrange
            const start = 1100;
            const take = 900;

            // act
            const tradeType = calc.getTradeTypeByStartTake(start, take);

            // assert
            expect(tradeType).toBe(ETradeType.Short);
        });
    });

});
