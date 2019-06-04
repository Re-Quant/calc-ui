import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TradeFormValidatorsService } from './trade-form-validators.service';
import { ETradeType } from '../models';

@Injectable()
export class TradeFormService {
  public form: FormGroup;

  constructor(
    private pizzaValidatorsService: TradeFormValidatorsService,
    private fb: FormBuilder
  ) {
    const config: any = {
      commonPanel: this.fb.group({
        tradeType: [
          ETradeType.Long, [Validators.required],
        ],
        deposit: ['1000', [Validators.required, Validators.min(0.1)]],
        risk: ['1', [Validators.required, Validators.min(0), Validators.max(100)]],
        leverageAvailable: [true],
        feeEnabled: [true],
        marketMakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
        marketTakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
      }),
      entryPrice: null,
      stopLoss: null,
      takeProfit: null,
    };
    this.form = this.fb.group(config as any);
  }

  get isValid(): boolean {
    return true;
  }
}
