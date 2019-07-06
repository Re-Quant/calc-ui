import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeOrderBase } from '@z-brain/calc';

@Component({
  selector: 'app-order-outputs',
  templateUrl: './order-outputs.component.html',
  styleUrls: ['./order-outputs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderOutputsComponent {
  @Input()
  public data: TradeOrderBase;
}
