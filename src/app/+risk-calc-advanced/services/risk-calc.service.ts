import { Injectable } from '@angular/core';
import { RiskIncomeData } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RiskCalcService {
  public data$: Observable<any>; // CalculatedData

  public calculateTrade(income: RiskIncomeData): void {
    console.log(income);
  }
}
