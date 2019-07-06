import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faChevronUp, faChevronDown, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-inputs',
  templateUrl: './order-inputs.component.html',
  styleUrls: ['./order-inputs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderInputsComponent {
  @Input()
  public form: FormGroup;

  @Input()
  public calculationData: object[];

  @Output()
  public addOrder = new EventEmitter<'above' | 'below'>();

  @Output()
  public removeOrderItem = new EventEmitter<void>();

  @Output()
  public setOrderItemPercentage = new EventEmitter<string>();

  public faChevronUp = faChevronUp;
  public faChevronDown = faChevronDown;
  public faPlusCircle = faPlusCircle;
  public faMinusCircle = faMinusCircle;
  public percentRange: string[] = ['10', '20', '25', '50', '75', '80', '100'];

  public addOrderAbove(): void {
    this.addOrder.emit('above');
  }

  public addOrderBelow(): void {
    this.addOrder.emit('below');
  }

  public removeItem(): void {
    this.removeOrderItem.emit();
  }

  public setPercentage(value: string) {
    this.setOrderItemPercentage.emit(value);
  }
}
