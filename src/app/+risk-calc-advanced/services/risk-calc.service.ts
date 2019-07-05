import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TradeInfo, TradeInfoArgs, zRisk } from '@z-brain/calc';

@Injectable({
  providedIn: 'root',
})
export class RiskCalcService {
  public data$: Observable<any>; // CalculatedData

  public calculateTrade(income: TradeInfoArgs): TradeInfo {
    return zRisk.getTradeInfo(income);
  }
}
