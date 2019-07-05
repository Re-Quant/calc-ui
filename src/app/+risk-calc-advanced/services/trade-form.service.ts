import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TradeFormValidatorsService } from './trade-form-validators.service';
import { CommonRiskFormData, OrderFormData, RiskIncomeFormData, TypeFee } from '../models';
import { ETradeType, TradeInfoArgs, TradeOrderArg } from '@z-brain/calc';

@Injectable()
export class TradeFormService {
  public form: FormGroup;
  private defaultItem: OrderFormData = {
    activeOrder: true,
    price: '',
    percent: '',
    typeOfFee: TypeFee.marketMaker,
  };

  constructor(
    private pizzaValidatorsService: TradeFormValidatorsService,
    private fb: FormBuilder
  ) {
    const commonPanelConfig = this.fb.group({
      tradeType: [
        ETradeType.Long, [Validators.required],
      ],
      deposit: ['1000', [Validators.required, Validators.min(0.1)]],
      risk: ['1', [Validators.required, Validators.min(0), Validators.max(100)]],
      leverageAvailable: [true],
      maxLeverage: ['5'],
      feeEnabled: [true],
      marketMakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
      marketTakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
      maxTradeVolumeQuoted: ['5000'],
      breakevenOrderType: [TypeFee.marketMaker],
    });
    const entryPriceConfig = this.fb.array([
      this.createOrderItem({
        activeOrder: true,
        price: '100',
        percent: '10',
        typeOfFee: TypeFee.marketMaker,
      }),
      this.createOrderItem({
        activeOrder: true,
        price: '100',
        percent: '10',
        typeOfFee: TypeFee.marketMaker,
      })
    ]);
    const stopLossConfig = this.fb.array([
      this.createOrderItem({
        activeOrder: true,
        price: '90',
        percent: '5',
        typeOfFee: TypeFee.marketTaker,
      })
    ]);
    const takeProfitConfig = this.fb.array([
      this.createOrderItem({
        activeOrder: true,
        price: '150',
        percent: '25',
        typeOfFee: TypeFee.marketTaker,
      })
    ]);
    const config: any = {
      commonPanel: commonPanelConfig,
      entries: entryPriceConfig,
      stops: stopLossConfig,
      takes: takeProfitConfig,
    };
    this.form = this.fb.group(config as any);
  }

  public createOrderItem(data: OrderFormData): FormGroup {
    return this.fb.group({
      activeOrder: [data.activeOrder],
      price: [data.price, [Validators.required]],
      percent: [data.percent, [Validators.required]],
      typeOfFee: [data.typeOfFee, [Validators.required]],
    });
  }

  public addOrderItemAbove(entity: string, index: number): void {
    this[entity] = this.form.get(entity) as FormArray;
    this[entity].insert(index, this.createOrderItem(this.defaultItem));

  }

  public addOrderItemBelow(entity: string, index: number): void {
    this[entity] = this.form.get(entity) as FormArray;
    this[entity].insert(index + 1, this.createOrderItem(this.defaultItem));
  }

  public removeOrderItem(entity: string, index: number): void {
    this[entity] = this.form.get(entity) as FormArray;
    this[entity].removeAt(index);
  }

  public setOrderItemPercentage(data: { value: string; item: FormGroup }): void {
    data.item.controls['percent'].setValue(data.value);
  }

  public equalizePercentage(entity: string) {
    this[entity] = this.form.get(entity) as FormArray;

    const countFormGroup: any = this[entity].length;
    const valueForOneCell: string = this.roundPercentage(countFormGroup);

    this[entity].controls.forEach(v => {
     v.controls.percent.setValue(valueForOneCell);
    });
  }

  public convertToTradeInfoArgs(value: RiskIncomeFormData): TradeInfoArgs {
    return {
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
  }

  private roundPercentage(count: number): string {
    const initValue = '100';

    return count === 1 ? initValue : (100 / count).toString();
  }

  get isValid(): boolean {
    return true;
  }

  private formatOrderData(orderInfo: OrderFormData[], commonData: CommonRiskFormData): TradeOrderArg[] {
    return orderInfo.map((item: OrderFormData) => {
      return {
        // activeOrder: !!item.activeOrder,
        price: +item.price,
        volumePart: +item.percent / 100,
        fee: this.getOrderFee(item, commonData),
      };
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
