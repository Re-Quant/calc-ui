import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ETradeType, RiskIncomeData } from '../../models';
import { RiskIncomeFormData } from './risk-form.models';

@Component({
    selector: 'rc-risk-form',
    templateUrl: './risk-form.component.html',
    styleUrls: ['./risk-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskFormComponent implements OnInit {
  // TODO: need to remove Partial
  @Output()
  public dataChange = new EventEmitter<Partial<RiskIncomeData>>();

  public form: FormGroup;

  public constructor(
    private fb: FormBuilder,
  ) {
  }

  public ngOnInit(): void {
    const config: { [key in keyof RiskIncomeFormData]: any } = {
      tradeType: [
        ETradeType.Long, [Validators.required],
      ],

      deposit: ['1000', [Validators.required, Validators.min(0.1)]],
      risk: ['1', [Validators.required, Validators.min(0), Validators.max(100)]],

      leverageAvailable: [true],

      feeEnabled: [true],

      marketMakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
      marketTakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
    };
    this.form = this.fb.group(config as any);

    this.onChange();
  }

  public onChange(): void {
    if (this.form.valid) {
      const value: RiskIncomeFormData = this.form.value;

      // TODO: need to remove Partial
      const data: Partial<RiskIncomeData> = {
        tradeType: value.tradeType,

        deposit: +value.deposit,
        risk: +value.risk / 100,

        leverageAvailable: !!+value.leverageAvailable,
        feeEnabled: !!+value.feeEnabled,

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
      // if (field === 'startPrice' || field === 'stopPrice' || field === 'takePrice' || field === 'tradeType') {
        const control = formGroup.get(field);

        control.markAsTouched({ onlySelf: true });
        control.updateValueAndValidity();
      // }
    });
  }
}
