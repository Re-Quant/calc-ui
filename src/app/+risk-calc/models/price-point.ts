import { DepositDiff } from './deposit-diff';
import { EPricePointType } from './fold-type.enum';

export interface PricePoint {
    type: EPricePointType;

    /** Dollars */
    price: number;

    diff: DepositDiff;

    /**
     * @example 5 means risk ratio 1:5
     */
    ratio: number;
}
