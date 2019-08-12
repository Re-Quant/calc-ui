import {
  ChangeDetectionStrategy,
  Component, EventEmitter, forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PercentageComponent),
      multi: true
    }
  ]
})
export class PercentageComponent implements OnInit {
  @Input()
  public percentage: string;
  @Output()
  public setOrderPercentage: EventEmitter<string> = new EventEmitter<string>();

  public percentRange: string[] = ['10', '20', '25', '50', '75', '80', '100'];

  private _value: string;
  private onChange: any = () => {};
  private onTouched: any = () => {};

  public constructor() {}

  public ngOnInit() {
    this.value = this.percentage || '';
  }

  get value() {
    return this._value;
  }

  set value(val: string) {
    console.log('type of value', typeof val);
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
    }
  }

  public writeValue(value): void {
    if (value) {
      this.value = value;
    }
  }

  public registerOnChange(fn): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn): void {
    this.onTouched = fn;
  }

  public setPercentage(value: string): void {
    this.value = value;
  }
}
