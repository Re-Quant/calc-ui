import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TradeInfoArgs } from '@z-brain/calc';

@Injectable({
  providedIn: 'root',
})
export class RiskCalcService {
  public data$: Observable<any>; // CalculatedData

  public calculateTrade(income: TradeInfoArgs): void {
    console.log(income);
  }
}
