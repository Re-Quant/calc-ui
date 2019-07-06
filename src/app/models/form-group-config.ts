import { ValidatorFn } from '@angular/forms';

export type FormGroupConfig<T> = {
  [key in keyof T]:  T[key]
                  | [T[key]]
                  | [
                      T[key],
                      ValidatorFn | ValidatorFn[]
                    ];
};
