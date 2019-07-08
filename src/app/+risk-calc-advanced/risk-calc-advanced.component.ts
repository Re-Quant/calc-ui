import { Component, OnInit } from '@angular/core';
import { RiskCalcService } from './risk-calc.service';
import { TradeInfo, TradeInfoArgs } from '@z-brain/calc';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-risk-calc-advanced',
  templateUrl: './risk-calc-advanced.component.html',
  styleUrls: ['./risk-calc-advanced.component.scss'],
})
export class RiskCalcAdvancedComponent implements OnInit {
  public data$: Observable<TradeInfo | undefined>;

  public get isShowDebugPanels(): boolean {
    return !!JSON.parse(localStorage.getItem('debug.show-debug-panels'));
  }

  public constructor(
    private riskCalcService: RiskCalcService,
  ) {}

  public ngOnInit() {
    this.data$ = this.riskCalcService.data$;

    this.logger();
  }

  public formDataChanged(data: TradeInfoArgs): void {
    this.riskCalcService.updateData(data);
  }

  private logger() {
    this.riskCalcService.data$
      .subscribe((data) => {
        console.table(data);
      });
  }
}

