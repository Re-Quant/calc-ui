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

    describe('getUniversalFee', () => {
        it('should handle Long trade', () => {
            // arrange
            const opts = { buyFee: 0.002, sellFee: 0.003, type: ETradeType.Long };
            const expected: IUniversalFee = { entryFee: opts.buyFee, exitFee: opts.sellFee };

            // act
            const res = calc.getUniversalFee(opts);

            // assert
            expect(res).toEqual(expected);
        });

        it('should handle Short trade', () => {
            // arrange
            const opts = { buyFee: 0.002, sellFee: 0.003, type: ETradeType.Short };
            const expected: IUniversalFee = { entryFee: opts.sellFee, exitFee: opts.buyFee };

            // act
            const res = calc.getUniversalFee(opts);

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
