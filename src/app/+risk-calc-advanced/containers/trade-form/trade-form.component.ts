import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TradeFormService } from '../../services/trade-form.service';
import { TradeFormValidatorsService } from '../../services/trade-form-validators.service';
import { Order, OrderFormData, RiskIncomeData, RiskIncomeFormData } from '../../models';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.scss'],
  providers: [
    TradeFormService,
    TradeFormValidatorsService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeFormComponent {
  @Output()
  public dataChange = new EventEmitter<RiskIncomeData>();

  constructor(
    private tradeFormService: TradeFormService,
  ) { }

  get form(): FormGroup {
    return this.tradeFormService.form;
  }

  public onChange(): void {
    if (this.form.valid) {
      const value: RiskIncomeFormData = this.form.value;

      const data: RiskIncomeData = {
        tradeType: value.commonPanel.tradeType,

        entries: this.formatOrderData(value.entries),
        stopLosses: this.formatOrderData(value.stopLosses),
        takeProfits: this.formatOrderData(value.takeProfits),

        deposit: +value.commonPanel.deposit,
        risk: +value.commonPanel.risk / 100,

        leverageAvailable: !!+value.commonPanel.leverageAvailable,
        feeEnabled: !!+value.commonPanel.feeEnabled,

        maxLeverage: +value.commonPanel.maxLeverage,
        maxTradeSum: +value.commonPanel.maxTradeSum,

        marketMakerFee: +value.commonPanel.marketMakerFee / 100,
        marketTakerFee: +value.commonPanel.marketTakerFee / 100,
      };

      this.dataChange.emit(data);
    } else {
      console.log('invalid form');
    }
  }

  public addOrderItemAbove(entity: string, index: number) {
    this.tradeFormService.addOrderItemAbove(entity, index);
  }

  public addOrderItemBelow(entity: string, index: number) {
    this.tradeFormService.addOrderItemBelow(entity, index);
  }

  public removeOrderItem(entity: string, index: number) {
    this.tradeFormService.removeOrderItem(entity, index);
  }

  public onSetOrderItemPercentage(data: { value: string; item: FormGroup }) {
    this.tradeFormService.setOrderItemPercentage(data);
  }

  public equalizePercentage(entity: string) {
    this.tradeFormService.equalizePercentage(entity);
  }

  private formatOrderData(data: OrderFormData[]): Order[] {
    return data.map((item: OrderFormData) => {
      return {
        activeOrder: !!item.activeOrder,
        price: +item.price,
        percent: +item.percent,
        typeOfFee: item.typeOfFee,
      };
    });
  }
}
