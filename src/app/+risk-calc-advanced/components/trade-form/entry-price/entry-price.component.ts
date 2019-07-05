import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-entry-price',
  templateUrl: './entry-price.component.html',
  styleUrls: ['./entry-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryPriceComponent {
  @Input()
  public group: FormGroup;

  @Input()
  public formName: string;

  @Input()
  public calculationData: object[];

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

  @Output()
  public setOrderItemPercentage = new EventEmitter<{ value: string; item: FormGroup }>();

  constructor() { }

  public onChange() {
    this.dataChange.emit();
  }

  public onAddItemAbove(index: number): void {
    this.addOrderItemAbove.emit(index);
  }

  public onAddItemBelow(index: number): void {
    this.addOrderItemBelow.emit(index);
  }

  public onRemoveItem(index: number): void {
    this.removeOrderItem.emit(index);
  }

  public onSetOrderItemPercentage(value: string, item: FormGroup): void {
    this.setOrderItemPercentage.emit({ value, item });
  }

  public equalize(): void {
    this.equalizePercentage.emit(this.formName);
  }
}
