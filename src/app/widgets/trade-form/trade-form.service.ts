import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ETradeType, TradeInfoArgs, TradeOrderArg } from '@z-brain/calc';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

import { TradeFormValidatorsService } from './trade-form-validators.service';
import { CommonRiskFormData, OrderFormData, RiskIncomeFormData, TypeFee } from './trade-form.models';

@Injectable()
export class TradeFormService {
  public tradeInfo$: Observable<TradeInfoArgs>;
  public form: FormGroup;

  public get commonSubForm(): FormGroup {
    return this.form.get('commonPanel') as FormGroup;
  }

  public get entriesSubForm(): FormArray {
    return this.form.get('entries') as FormArray;
  }

  public get stopsSubForm(): FormArray {
    return this.form.get('stops') as FormArray;
  }

  public get takesSubForm(): FormArray {
    return this.form.get('takes') as FormArray;
  }


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

    this.tradeInfo$ = this.form.valueChanges.pipe(
      startWith(this.form.value as RiskIncomeFormData),
      filter(() => this.form.valid),
      distinctUntilChanged((p, q) => _.isEqual(p, q)),
      map((data: RiskIncomeFormData) => this.convertToTradeInfoArgs(data)),
      shareReplay(1),
    );
  }

  public createOrderItem(data: OrderFormData): FormGroup {
    return this.fb.group({
      activeOrder: [data.activeOrder],
      price: [data.price, [Validators.required]],
      percent: [data.percent, [Validators.required]],
      typeOfFee: [data.typeOfFee, [Validators.required]],
    });
  }

  public addOrderItemAbove(form: FormArray, index: number): void {
    form.insert(index, this.createOrderItem(this.defaultItem));

  }

  public addOrderItemBelow(form: FormArray, index: number): void {
    form.insert(index + 1, this.createOrderItem(this.defaultItem));
  }

  public removeOrderItem(form: FormArray, index: number): void {
    form.removeAt(index);
  }

  public setOrderItemPercentage(data: { value: string; item: FormGroup }): void {
    data.item.controls['percent'].setValue(data.value);
  }

  /**
   * @param form entries or stops or takes sub form
   */
  public equalizePercentage(form: FormArray) {

    const patch: Pick<{ percent: number }, 'percent'> = { percent: 100 / form.length };

    form.controls.forEach(v => v.patchValue(patch));
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
