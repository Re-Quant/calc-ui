import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RiskIncomeData } from '../../models';

export interface RiskIncomeData {
    startPrice: string;
    stopPrice: string;
    takePrice: string;

    deposit: string;
    risk: string;

    buyFee: string;
    sellFee: string;

    marketMakerFee?: string;
    marketTakerFee?: string;
}

function takePrice(startPriceControlName: string, stopPriceControlName: string) {
    return (control: AbstractControl) => {
        const parent = control.parent;
        if (!parent) { return null; }

        const startControl = parent.get(startPriceControlName);
        const stopControl = parent.get(stopPriceControlName);
        if (!startControl || !stopControl) { return null; }

        const startValue = +startControl.value;
        const stopValue = +stopControl.value;
        const takeValue = +control.value;

        const isLong = startValue > stopValue;

        if (isLong && takeValue <= startValue) {
            return { takeIsLessOrEqualStart: true };
        }
        if (!isLong && takeValue >= startValue) {
            return { takeIsBiggerOrEqualStart: true };
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
    ) {}

    public ngOnInit(): void {
        const config: { [key in keyof RiskIncomeData]: any } = {
            startPrice: ['3800', [Validators.required, Validators.min(0)]],
            stopPrice:  ['3725', [Validators.required, Validators.min(0)]],
            takePrice: [
                '4000',
                [
                    Validators.required,
                    Validators.min(1),
                    takePrice('startPrice', 'stopPrice'),
                ],
            ],

            deposit: ['1000', [Validators.required, Validators.min(0.1)]],
            risk:    ['1', [Validators.required, Validators.min(0), Validators.max(100)]],

            leverageAvailable: [true],

            buyFee:  ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
            sellFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],

            orderStartTypeOfFee: ['marketMakerFee'],
            stopLossTypeOfFee: ['marketMakerFee'],

            marketMakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
            marketTakerFee: ['0.2', [Validators.required, Validators.min(0), Validators.max(100)]],
        };
        this.form = this.fb.group(config as any);

        this.onChange();
    }

    public onChange(): void {
        if (this.form.valid) {
            const data: RiskIncomeData = {
                startPrice: +this.form.value['startPrice'],
                stopPrice:  +this.form.value['stopPrice'],
                takePrice:  +this.form.value['takePrice'],

                deposit: +this.form.value['deposit'],
                risk:    +this.form.value['risk'] / 100,

                leverageAvailable: !!+this.form.value['leverageAvailable'],

                buyFee:  +this.form.value['buyFee'] / 100,
                sellFee: +this.form.value['sellFee'] / 100,

                orderStartTypeOfFee: this.form.value['orderStartTypeOfFee'],
                stopLossTypeOfFee: this.form.value['stopLossTypeOfFee'],

                marketMakerFee: +this.form.value['marketMakerFee'] / 100,
                marketTakerFee: +this.form.value['marketTakerFee'] / 100,
            };

            this.dataChange.emit(data);
        }
    }
}
