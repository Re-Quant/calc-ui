import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faChevronUp, faChevronDown, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent {
  @Input()
  public group: FormGroup;

  @Input()
  public formName: string;

  @Input()
  public calculationData: object;

  @Output()
  public dataChange = new EventEmitter<void>();

  @Output()
  public addOrderItemAbove = new EventEmitter<number>();

  @Output()
  public addOrderItemBelow = new EventEmitter<number>();

  @Output()
  public removeOrderItem = new EventEmitter<number>();

  @Output()
  public equalizePercentage = new EventEmitter<string>();

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

  public equalize(): void {
    this.equalizePercentage.emit(this.formName);
  }
}
