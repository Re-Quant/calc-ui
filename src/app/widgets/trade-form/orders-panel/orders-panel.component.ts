import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

import { TradeOrderBase, zMath } from '@z-brain/calc';
import { AddOrderEvent, MoveOrderEvent, OrderFormData } from '../trade-form.models';

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
  public removeOrder = new EventEmitter<number>();

  @Output()
  public moveOrder = new EventEmitter<MoveOrderEvent>();

  @Output()
  public equalizePercentage = new EventEmitter<void>();

  @Output()
  public setOrderPercentage = new EventEmitter<{ value: string; item: AbstractControl }>();

  constructor() { }

  public onAddOrder(index: number, place: 'above' | 'below'): void {
    this.addOrder.emit({ index, place });
  }

  public onRemoveOrder(index: number): void {
    this.removeOrder.emit(index);
  }

  public onMoveOrder(index: number, place: 'above' | 'below'): void {
    this.moveOrder.emit({ index, place });
  }

  public onSetOrderPercentage(value: string, item: AbstractControl): void {
    this.setOrderPercentage.emit({ value, item });
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
