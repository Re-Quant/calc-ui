import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ETradeType, RiskIncomeData, TypeFee } from '../../models';

export interface RiskIncomeFormData {
  tradeType: ETradeType;

  startPrice: string;
  stopPrice: string;
  takePrice: string;

  deposit: string;
  risk: string;

  leverageAvailable: boolean;

  orderStartTypeOfFee: TypeFee;
  stopLossTypeOfFee: TypeFee;
  takeProfitPriceTypeOfFee: TypeFee;

  marketMakerFee?: string;
  marketTakerFee?: string;
}

function startPrice(tradeTypeControlName, stopPriceControlName) {
  return (AC: AbstractControl) => {
    const parent = AC.parent;

    if (!parent) {
      return null;
    }

    const currentValue = +AC.value;
    const tradeTypeControl = parent.get(tradeTypeControlName);
    const stopControl = parent.get(stopPriceControlName);

    const tradeTypeControlValue = tradeTypeControl.value;
    const stopControlValue = +stopControl.value;

    if (tradeTypeControlValue === ETradeType.Long
      && stopControlValue >= currentValue) {
      return { startIsLessOrEqualStart: true };
    }

    if (tradeTypeControlValue !== ETradeType.Long
      && stopControlValue <= currentValue) {
      return {startIsBiggerOrEqualStart: true};
    }

    console.log(true);

    return null;
  };
}

function stopPrice(tradeTypeControlName, startPriceControlName) {
  return (AC: AbstractControl) => {
    const parent = AC.parent;

    if (!parent) {
      return null;
    }

    const currentValue = +AC.value;
    const tradeTypeControl = parent.get(tradeTypeControlName);
    const startControl = parent.get(startPriceControlName);

    const tradeTypeControlValue = tradeTypeControl.value;
    const startControlValue = +startControl.value;

    if (tradeTypeControlValue === ETradeType.Long
      && startControlValue <= currentValue) {
      return { stopIsLessOrEqualStart: true };
    }

    if (tradeTypeControlValue !== ETradeType.Long
      && startControlValue >= currentValue) {
      return {stopIsBiggerOrEqualStart: true};
    }

    console.log(true);

    return null;
  };
}

function takePrice(startPriceControlName: string, stopPriceControlName: string) {
  return (control: AbstractControl) => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }

    const startControl = parent.get(startPriceControlName);
    const stopControl = parent.get(stopPriceControlName);
    if (!startControl || !stopControl) {
      return null;
    }

    const startValue = +startControl.value;
    const stopValue = +stopControl.value;
    const takeValue = +control.value;

    const isLong = startValue > stopValue;

    if (isLong && takeValue <= startValue) {
      return {takeIsLessOrEqualStart: true};
    }
    if (!isLong && takeValue >= startValue) {
      return {takeIsBiggerOrEqualStart: true};
    }

    return null;
  };
}

@Component({
    selector: 'app-risk-form',
    templateUrl: './risk-form.component.html',
    styleUrls: ['./risk-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskFormComponent implements OnInit {

  @Output()
  public dataChange = new EventEmitter<RiskIncomeData>();

  public form: FormGroup;

  public constructor(
    private fb: FormBuilder,
  ) {
  }

  public ngOnInit(): void {
    const config: { [key in keyof RiskIncomeFormData]: any } = {
      tradeType: [ETradeType.Long, [Validators.required]],

      startPrice: [
        '3800',
        [
          Validators.required,
          Validators.min(0),
          startPrice('tradeType', 'stopPrice')
        ],
      ],
      stopPrice: [
        '3725',
        [
          Validators.required,
          Validators.min(0),
          stopPrice('tradeType', 'startPrice')
        ],
      ],
      takePrice: [
        '4100',
        [
          Validators.required,
          Validators.min(1),
          takePrice('startPrice', 'stopPrice'),
        ],
      ],

      deposit: ['1000', [Validators.required, Validators.min(0.1)]],
      risk: ['1', [Validators.required, Validators.min(0), Validators.max(100)]],

      leverageAvailable: [true],

      orderStartTypeOfFee: [TypeFee.MarketMakerFee],
      stopLossTypeOfFee: [TypeFee.MarketTakerFee],
      takeProfitPriceTypeOfFee: [TypeFee.MarketTakerFee],

      marketMakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
      marketTakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
    };
    this.form = this.fb.group(config as any);

    this.onChange();
  }

  public onChange(): void {
    if (this.form.valid) {
      const value: RiskIncomeFormData = this.form.value;

      const data: RiskIncomeData = {
        tradeType: value.tradeType,

        startPrice: +value.startPrice,
        stopPrice: +value.stopPrice,
        takePrice: +value.takePrice,

        deposit: +value.deposit,
        risk: +value.risk / 100,

        leverageAvailable: !!+value.leverageAvailable,

        orderStartTypeOfFee: value.orderStartTypeOfFee,
        stopLossTypeOfFee: value.stopLossTypeOfFee,
        takeProfitPriceTypeOfFee: value.takeProfitPriceTypeOfFee,

        marketMakerFee: +value.marketMakerFee / 100,
        marketTakerFee: +value.marketTakerFee / 100,
      };

      this.dataChange.emit(data);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      if (field === 'startPrice' || field === 'stopPrice' || field === 'takePrice' || field === 'tradeType') {
        const control = formGroup.get(field);

        control.updateValueAndValidity();
      }
    });
  }
}
