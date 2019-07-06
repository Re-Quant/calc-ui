import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ETradeType } from '@z-brain/calc';

import { FormGroupConfig } from '../../models/form-group-config';

import { TradeFormValidatorsService } from './trade-form-validators.service';
import { CommonFormData, OrderFormData, TradeFormData, TypeFee } from './trade-form.models';

@Injectable()
export class TradeFormService {
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
  }

  public addOrder({ form, place = 'below', index, data }: {
    form: FormArray,
    place?: 'above' | 'below',
    index?: number,
    data?: OrderFormData,
  }): void {
    index = index === undefined ? Math.max(0, form.length - 1) :
            place === 'above' ? index : index + 1;

    form.insert(index, this.createOrderForm(data || this.defaultItem));
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
    const patch: Pick<OrderFormData, 'percent'> = { percent: String(100 / form.length) };

    form.controls.forEach(v => v.patchValue(patch));
  }

  get isValid(): boolean {
    return true;
  }

  private initForm(): void {
    const commonConfig: FormGroupConfig<CommonFormData> = {
      deposit: ['1000', [Validators.required, Validators.min(0.1)]],
      risk: ['1', [Validators.required, Validators.min(0), Validators.max(100)]],
      leverageAvailable: [true],
      maxLeverage: ['5'],
      feeEnabled: [true],
      marketMakerFee: ['0.1', [Validators.required, Validators.min(0), Validators.max(100)]],
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

    this.addOrder({
      form: this.entriesSubForm,
      data: {
        activeOrder: true,
        price: '100',
        percent: '100',
        typeOfFee: TypeFee.marketMaker,
      },
    });

    this.addOrder({
      form: this.stopsSubForm,
      data: {
        activeOrder: true,
        price: '90',
        percent: '100',
        typeOfFee: TypeFee.marketTaker,
      },
    });

    this.addOrder({
      form: this.takesSubForm,
      data: {
        activeOrder: true,
        price: '150',
        percent: '100',
        typeOfFee: TypeFee.marketTaker,
      },
    });
  }

  private createOrderForm(data: OrderFormData): FormGroup {
    const config: FormGroupConfig<OrderFormData> = {
      activeOrder: [data.activeOrder],
      price: [data.price, [Validators.required]],
      percent: [data.percent, [Validators.required]],
      typeOfFee: [data.typeOfFee, [Validators.required]],
    };

    return this.fb.group(config);
  }
}
