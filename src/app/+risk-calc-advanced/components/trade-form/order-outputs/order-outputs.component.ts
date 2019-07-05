import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-orders-panel',
  templateUrl: './order-outputs.component.html',
  styleUrls: ['./order-outputs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderOutputsComponent {

}
