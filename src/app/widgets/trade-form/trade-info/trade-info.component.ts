import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TradeInfo } from '@z-brain/calc';

@Component({
  selector: 'app-trade-info',
  templateUrl: './trade-info.component.html',
  styleUrls: ['./trade-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeInfoComponent implements OnInit {
  @Input()
  public data: TradeInfo;

  public ngOnInit(): void {
    console.log(this.data);
  }
}
