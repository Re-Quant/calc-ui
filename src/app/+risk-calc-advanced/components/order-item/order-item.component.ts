import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faChevronUp, faChevronDown, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemComponent {
  @Input()
  public group: FormGroup;

  @Input()
  public formName: string;

  @Output()
  public dataChange = new EventEmitter<void>();

  @Output()
  public addOrderItemAbove = new EventEmitter<number>();

  @Output()
  public addOrderItemBelow = new EventEmitter<number>();

  @Output()
  public removeOrderItem = new EventEmitter<number>();

  public faChevronUp = faChevronUp;
  public faChevronDown = faChevronDown;
  public faPlusCircle = faPlusCircle;
  public faMinusCircle = faMinusCircle;
  public percentRange: string[] = ['10', '20', '25', '50', '75', '80', '100'];

  constructor() { }

  public onChange() {
    this.dataChange.emit();
  }

  public addItemAbove(index: number): void {
    this.addOrderItemAbove.emit(index);
  }

  public addItemBelow(index: number): void {
    this.addOrderItemBelow.emit(index);
  }

  public removeItem(index: number): void {
    this.removeOrderItem.emit(index);
  }

  public setPercentage(value: string, item: any) {
    item.controls['percent'].setValue(value);
  }

  public equalizePercentage(): void {
    const controls = this.group.controls;
    const countFormGroup: any = controls.length;
    const valueForOneCell: string = this.roundPercentage(countFormGroup);

    for (const index of Object.keys(controls)) {
      controls[index]['controls']['percent'].setValue(valueForOneCell);
    }
  }

  private roundPercentage(count: number): string {
    const initValue = '100';

    if (count === 1) {
      return initValue;
    }

    if (count % 2 === 0) {
      return (100 / count).toString();
    }

    return (100 / count).toFixed(3);
  }
}
