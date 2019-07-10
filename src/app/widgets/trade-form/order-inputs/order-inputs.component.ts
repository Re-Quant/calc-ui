import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faChevronUp, faChevronDown, faPlusCircle, faMinusCircle, faChevronCircleUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
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
  public moveOrder = new EventEmitter<'above' | 'below'>();

  @Output()
  public removeOrder = new EventEmitter<void>();

  @Output()
  public setOrderPercentage = new EventEmitter<string>();

  public faChevronUp = faChevronUp;
  public faChevronDown = faChevronDown;
  public faPlusCircle = faPlusCircle;
  public faMinusCircle = faMinusCircle;
  public faChevronCircleUp = faChevronCircleUp;
  public faChevronCircleDown = faChevronCircleDown;
  public percentRange: string[] = ['10', '20', '25', '50', '75', '80', '100'];

  public addOrderAbove(): void {
    this.addOrder.emit('above');
  }

  public addOrderBelow(): void {
    this.addOrder.emit('below');
  }

  public removeItem(): void {
    this.removeOrder.emit();
  }

  public moveOrderAbove(): void {
    this.moveOrder.emit('above');
  }

  public moveOrderBelow(): void {
    this.moveOrder.emit('below');
  }

  public setPercentage(value: string) {
    this.setOrderPercentage.emit(value);
  }
}
