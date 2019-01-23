import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CalculatedData, ETradeType } from '../../models';

@Component({
    selector: 'app-trade-info',
    templateUrl: './trade-info.component.html',
    styleUrls: [ './trade-info.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TradeInfoComponent {

    @Input()
    public data: CalculatedData;

    public get isTradeTypeLong(): boolean {
        return this.data && this.data.tradeType === ETradeType.Long;
    }

    public get tradeDirectionCssClass(): string {
        return this.isTradeTypeLong ? 'trade-direction--long' : 'trade-direction--short';
    }

}
