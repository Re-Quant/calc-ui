import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { TradeOrderBase } from '@z-brain/calc';

@Component({
  selector: 'app-orders-panel',
  templateUrl: './orders-panel.component.html',
  styleUrls: ['./orders-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPanelComponent {
  @Input()
  public form: FormGroup;

  @Input()
  public tradeOrderBase: TradeOrderBase[];

  @Output()
  public addOrderItemAbove = new EventEmitter<number>();

  @Output()
  public addOrderItemBelow = new EventEmitter<number>();

  @Output()
  public removeOrderItem = new EventEmitter<number>();

  @Output()
  public equalizePercentage = new EventEmitter<void>();

  @Output()
  public setOrderItemPercentage = new EventEmitter<{ value: string; item: AbstractControl }>();

  constructor() { }

  public onAddItemAbove(index: number): void {
    this.addOrderItemAbove.emit(index);
  }

  public onAddItemBelow(index: number): void {
    this.addOrderItemBelow.emit(index);
  }

  public onRemoveItem(index: number): void {
    this.removeOrderItem.emit(index);
  }

  public onSetOrderItemPercentage(value: string, item: AbstractControl): void {
    this.setOrderItemPercentage.emit({ value, item });
  }

  public equalize(): void {
    this.equalizePercentage.emit();
  }
}
