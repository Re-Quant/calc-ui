import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

import { TradeOrderBase, zMath } from '@z-brain/calc';
import { OrderFormData } from '../trade-form.models';

export interface AddOrderEvent {
  index: number;
  place: 'above' | 'below';
}


@Component({
  selector: 'app-orders-panel',
  templateUrl: './orders-panel.component.html',
  styleUrls: ['./orders-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPanelComponent {

  @Input()
  public form: FormArray;

  // @todo: replace with TradeOrder after update @z-brain/calc
  @Input()
  public tradeOrders?: TradeOrderBase[];

  @Output()
  public addOrder = new EventEmitter<AddOrderEvent>();

  @Output()
  public removeOrderItem = new EventEmitter<number>();

  @Output()
  public equalizePercentage = new EventEmitter<void>();

  @Output()
  public setOrderItemPercentage = new EventEmitter<{ value: string; item: AbstractControl }>();

  constructor() { }

  public onAddOrder(index: number, place: 'above' | 'below'): void {
    this.addOrder.emit({ index, place });
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

  public getTradeOrder(index: number): TradeOrderBase | undefined {
    if (!this.tradeOrders || !this.isOrderValidAndActive(index)) {
      return undefined;
    }

    const actualIndex = zMath.sigmaSum(index, i => +this.isOrderValidAndActive(i)) - 1;
    const order = this.tradeOrders[actualIndex];

    if (!order) {
      console.warn('getTradeOrder() Wrong actualIndex: ', actualIndex);
    }

    return order;
  }

  private isOrderValidAndActive(index: number): boolean {
    const controlName: keyof OrderFormData = 'activeOrder';
    const order = this.form.get([index]);
    return order.valid && order.get(controlName).value;
  }

}
