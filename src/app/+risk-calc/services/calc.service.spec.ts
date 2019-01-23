import { CalcService } from './calc.service';

describe('CalcService', () => {
    let calc: CalcService;

    beforeEach(() => {
        calc = new CalcService();
    });

    it('should create instance', () => {
        expect(calc).toBeFalsy();
    });
});
