import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TradeFormService } from '../../services/trade-form.service';
import { TradeFormValidatorsService } from '../../services/trade-form-validators.service';
import { CommonRiskFormData, OrderFormData, RiskIncomeFormData, TypeFee } from '../../models';
import { TradeInfoArgs, TradeOrderArg } from '@z-brain/calc';

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
  public dataChange = new EventEmitter<TradeInfoArgs>();

  constructor(
    private tradeFormService: TradeFormService,
  ) { }

  get form(): FormGroup {
    return this.tradeFormService.form;
  }

  public onChange(): void {
    if (this.form.valid) {
      const value: RiskIncomeFormData = this.form.value;

      const data: TradeInfoArgs = {
        deposit: +value.commonPanel.deposit,
        risk: +value.commonPanel.risk / 100,

        leverage: {
          allow: !!+value.commonPanel.leverageAvailable,
          max: +value.commonPanel.maxLeverage,
        },

        tradeType: value.commonPanel.tradeType,

        breakeven: {
          fee: this.getBreakevenFee(value.commonPanel),
        },

        entries: this.formatOrderData(value.entries, value.commonPanel),
        stops: this.formatOrderData(value.stops, value.commonPanel),
        takes: this.formatOrderData(value.takes, value.commonPanel),

        maxTradeVolumeQuoted: +value.commonPanel.maxTradeVolumeQuoted,
      };

      this.dataChange.emit(data);
    } else {
      console.log('invalid form');
    }
  }

  public addOrderItemAbove(entity: string, index: number) {
    this.tradeFormService.addOrderItemAbove(entity, index);
    this.onChange();
  }

  public addOrderItemBelow(entity: string, index: number) {
    this.tradeFormService.addOrderItemBelow(entity, index);
    this.onChange();
  }

  public removeOrderItem(entity: string, index: number) {
    this.tradeFormService.removeOrderItem(entity, index);
    this.onChange();
  }

  public onSetOrderItemPercentage(data: { value: string; item: FormGroup }) {
    this.tradeFormService.setOrderItemPercentage(data);
    this.onChange();
  }

  public equalizePercentage(entity: string) {
    this.tradeFormService.equalizePercentage(entity);
    this.onChange();
  }

  private formatOrderData(orderInfo: OrderFormData[], commonData: CommonRiskFormData): TradeOrderArg[] {
    return orderInfo.map((item: OrderFormData) => {
      // if (!!item.activeOrder) {
        return {
          // activeOrder: !!item.activeOrder,
          price: +item.price,
          volumePart: +item.percent / 100,
          fee: this.getOrderFee(item, commonData),
        };
      // }
    });
  }

  private getOrderFee(item: OrderFormData, commonData: CommonRiskFormData) {
    let fee = 0;

    if (!!+commonData.feeEnabled) {
      fee = item.typeOfFee === TypeFee.marketMaker ? +commonData.marketMakerFee : +commonData.marketTakerFee;
    }

    return fee;
  }

  private getBreakevenFee(commonData: CommonRiskFormData) {
    let fee = 0;

    if (!!+commonData.feeEnabled) {
      fee = commonData.breakevenOrderType === TypeFee.marketMaker ? +commonData.marketMakerFee : +commonData.marketTakerFee;
    }

    return fee;
  }
}
