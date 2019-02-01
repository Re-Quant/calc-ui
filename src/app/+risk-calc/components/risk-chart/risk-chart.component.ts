import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EPricePointType, PricePoint } from '../../models';

@Component({
    selector: 'app-risk-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [ './risk-chart.component.scss' ],
    templateUrl: './risk-chart.component.html',
})
export class RiskChartComponent implements OnChanges {

    /** Take Trade Price Point */
    @Input()
    public take: PricePoint;

    /** Breakeven Trade Price Point */
    @Input()
    public breakeven: PricePoint;

    @Input()
    public pricePoints: PricePoint[];

    public folds: { cssClass: string; }[] = [];

    public takeSpacePercent = 0;
    public takeComment?: string;
    public takeCssClass?: string;

    public breakevenSpacePercent = 0;

    private cssClassesMap = {
        [EPricePointType.Stop]:        'trade-type--stop',
        [EPricePointType.Start]:       'trade-type--start',
        [EPricePointType.BadTake]:     'trade-type--bad-take',
        [EPricePointType.GoodTake]:    'trade-type--good-take',
        [EPricePointType.AmazingTake]: 'trade-type--amazing-take',
    };
    private takeTradeCommentsMap = {
        [EPricePointType.BadTake]:     'Bad Trade',
        [EPricePointType.GoodTake]:    'Good Trade',
        [EPricePointType.AmazingTake]: 'Amazing Trade',
    };

    public ngOnChanges(changes: SimpleChanges) {

        if (changes['pricePoints']) {
            this.folds = this
                .pricePoints
                .filter(p => p.type !== EPricePointType.Start)
                .map((p, i, a) => {
                    const isUseNextType = a[i + 1]
                                       && a[i + 1].type !== p.type
                                       && a[i + 1].type !== EPricePointType.Stop;
                    const type = isUseNextType ? a[i + 1].type : p.type;

                    return {
                        cssClass: this.cssClassesMap[type],
                    };
                });

        }
        if (changes['pricePoints'] || changes['take']) {
            // @todo: test short
            const price1 = this.pricePoints[0].price;
            const price2 = this.pricePoints[this.pricePoints.length - 1].price;
            const price3 = this.take.price;

            this.takeSpacePercent = Math.abs(price1 - price3) * 100 / Math.abs(price1 - price2);
        }
        if (changes['pricePoints'] || changes['breakeven']) {
            // @todo: test short
            const price1 = this.pricePoints[0].price;
            const price2 = this.pricePoints[this.pricePoints.length - 1].price;
            const price3 = this.breakeven.price;

            this.breakevenSpacePercent = Math.abs(price1 - price3) * 100 / Math.abs(price1 - price2);
        }
        if (changes['take']) {
            this.takeComment = this.takeTradeCommentsMap[this.take.type];
            this.takeCssClass = this.cssClassesMap[this.take.type];
        }

    }

}
