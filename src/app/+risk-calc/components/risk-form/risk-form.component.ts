import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RiskIncomeData, TypeFee } from '../../models';

export interface RiskIncomeFormData {
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
      startPrice: ['3800', [Validators.required, Validators.min(0)]],
      stopPrice: ['3725', [Validators.required, Validators.min(0)]],
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
    }
  }
}
