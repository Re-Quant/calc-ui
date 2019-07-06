import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ETradeType, TradeInfoArgs, TradeOrderArg } from '@z-brain/calc';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

import { TradeFormValidatorsService } from './trade-form-validators.service';
import { CommonFormData, OrderFormData, TradeFormData, TypeFee } from './trade-form.models';

@Injectable()
export class TradeFormService {
  public tradeInfo$: Observable<TradeInfoArgs>;
  public form: FormGroup;

  public get commonSubForm(): FormGroup {
    const name: keyof TradeFormData = 'common';
    return this.form.get(name) as FormGroup;
  }

  public get entriesSubForm(): FormArray {
    const name: keyof TradeFormData = 'entries';
    return this.form.get(name) as FormArray;
  }

  public get stopsSubForm(): FormArray {
    const name: keyof TradeFormData = 'stops';
    return this.form.get(name) as FormArray;
  }

  public get takesSubForm(): FormArray {
    const name: keyof TradeFormData = 'takes';
    return this.form.get(name) as FormArray;
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
    this.initForm();
    this.fillFormUsingInitialData();

    this.tradeInfo$ = this.form.valueChanges.pipe(
      startWith(this.form.value as TradeFormData),
      filter(() => this.form.valid),
      distinctUntilChanged((p, q) => _.isEqual(p, q)),
      map((data: TradeFormData) => this.convertToTradeInfoArgs(data)),
      shareReplay(1),
    );
  }

  public addOrderItemAbove(form: FormArray, index: number): void {
    form.insert(index, this.createOrderForm(this.defaultItem));
  }

  public addOrderItemBelow(form: FormArray, index: number): void {
    form.insert(index + 1, this.createOrderForm(this.defaultItem));
  }



  // public addOrder(form: FormArray, index: number, place: 'above' | 'below'): void {
  //   form.insert(place === 'above' ? index : index + 1, this.createOrderForm(this.defaultItem));
  // }

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

  public convertToTradeInfoArgs(value: TradeFormData): TradeInfoArgs {
    return {
      deposit: +value.common.deposit,
      risk: +value.common.risk / 100,

      leverage: {
        allow: !!+value.common.leverageAvailable,
        max: +value.common.maxLeverage,
      },

      tradeType: value.common.tradeType,

      breakeven: {
        fee: this.getBreakevenFee(value.common),
      },

      entries: this.formatOrderData(value.entries, value.common),
      stops: this.formatOrderData(value.stops, value.common),
      takes: this.formatOrderData(value.takes, value.common),

      maxTradeVolumeQuoted: +value.common.maxTradeVolumeQuoted,
    };
  }

  get isValid(): boolean {
    return true;
  }

  private initForm(): void {
    const commonConfig: { [keys in keyof CommonFormData]: any[] } = {
      deposit: ['1000', [Validators.required, Validators.min(0.1)]],
      risk: ['1', [Validators.required, Validators.min(0), Validators.max(100)]],
      leverageAvailable: [true],
      maxLeverage: ['5'],
      feeEnabled: [true],
      marketMakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
      marketTakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
      maxTradeVolumeQuoted: ['5000'],
      tradeType: [ETradeType.Long, [Validators.required]],
      breakevenOrderType: [TypeFee.marketMaker],
    };

    const config: { [key in keyof TradeFormData]: FormGroup | FormArray } = {
      common: this.fb.group(commonConfig),
      entries: this.fb.array([]),
      stops: this.fb.array([]),
      takes: this.fb.array([]),
    };

    this.form = this.fb.group(config);
  }

  private fillFormUsingInitialData(): void {
    this.entriesSubForm.push(
      this.createOrderForm({
        activeOrder: true,
        price: '100',
        percent: '10',
        typeOfFee: TypeFee.marketMaker,
      })
    );

    this.stopsSubForm.push(
      this.createOrderForm({
        activeOrder: true,
        price: '90',
        percent: '5',
        typeOfFee: TypeFee.marketTaker,
      })
    );

    this.takesSubForm.push(
      this.createOrderForm({
        activeOrder: true,
        price: '150',
        percent: '25',
        typeOfFee: TypeFee.marketTaker,
      })
    );
  }

  private createOrderForm(data: OrderFormData): FormGroup {
    const config: { [keys in keyof OrderFormData]: any[] } = {
      activeOrder: [data.activeOrder],
      price: [data.price, [Validators.required]],
      percent: [data.percent, [Validators.required]],
      typeOfFee: [data.typeOfFee, [Validators.required]],
    };

    return this.fb.group(config);
  }

  private formatOrderData(orderInfo: OrderFormData[], commonData: CommonFormData): TradeOrderArg[] {
    return orderInfo.map((item: OrderFormData) => {
      return {
        // activeOrder: !!item.activeOrder,
        price: +item.price,
        volumePart: +item.percent / 100,
        fee: this.getOrderFee(item, commonData),
      };
    });
  }

  private getOrderFee(item: OrderFormData, commonData: CommonFormData) {
    let fee = 0;

    if (!!+commonData.feeEnabled) {
      fee = item.typeOfFee === TypeFee.marketMaker ? +commonData.marketMakerFee : +commonData.marketTakerFee;
    }

    return fee;
  }

  private getBreakevenFee(commonData: CommonFormData) {
    let fee = 0;

    if (!!+commonData.feeEnabled) {
      fee = commonData.breakevenOrderType === TypeFee.marketMaker ? +commonData.marketMakerFee : +commonData.marketTakerFee;
    }

    return fee;
  }
}
