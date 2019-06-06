import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TradeInfo, ETradeType } from '../../models';

const ELEMENT_DATA: TradeInfo = {
    tradeSum: {
      baseSum: 1,
      quotedSum: 1,
    },
    leverage: 1,
    breakeven: 1,
    riskRate: {
      risk: 1,
      profit: 2,
    },
    tradeType: ETradeType.Long,
    entryPrice: 1,
    stopPrice: 1,
    takePrice: 1,
  };

@Component({
  selector: 'app-trade-info',
  templateUrl: './trade-info.component.html',
  styleUrls: ['./trade-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeInfoComponent implements OnInit {
  @Input()
  public data: TradeInfo;

  public displayedColumns: string[] =
    ['tradeSum', 'leverage', 'breakeven', 'riskRate', 'tradeType', 'entryPrice', 'stopPrice', 'takePrice'];

  public ngOnInit(): void {
    this.data = ELEMENT_DATA;
  }

  public get isTradeTypeLong(): boolean {
    return this.data && this.data.tradeType === ETradeType.Long;
  }

  public get tradeDirectionCssClass(): string {
    return this.isTradeTypeLong ? 'trade-direction--long' : 'trade-direction--short';
  }
}
