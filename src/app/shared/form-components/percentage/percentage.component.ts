import {
  ChangeDetectionStrategy,
  Component, forwardRef,
  Input,
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
export class PercentageComponent {
  @Input()
  public percentage: string;

  public percentRange: string[] = ['10', '20', '25', '50', '75', '80', '100'];

  private _value: string = this.percentage || '';
  private onChange: any = () => {};
  private onTouched: any = () => {};

  get value() {
    return this._value;
  }

  set value(val: string) {
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

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setValue(value: string | Event): void {
    if (value instanceof Event) {
      const target: any = value.target;
      this.value = target.value;
    } else {
      this.value = value;
    }
  }
}
