import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { TradeInfo, TradeInfoArgs, zRisk } from '@z-brain/calc';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RiskCalcService {
  public data$: Observable<TradeInfo>;
  private inputData$ = new ReplaySubject<TradeInfoArgs>(1);

  public constructor() {
    this.data$ = this.inputData$.pipe(
      map(data => this.calculateTrade(data)),
      shareReplay(1),
    );
  }

  public updateData(data: TradeInfoArgs): void {
    this.inputData$.next(data);
  }

  private calculateTrade(income: TradeInfoArgs): TradeInfo {
    return zRisk.getTradeInfo(income);
  }
}
