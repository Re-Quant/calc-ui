import { Component, OnInit } from '@angular/core';
import { RiskIncomeData } from './models';
import { RiskCalcService } from './services/risk-calc.service';

@Component({
  selector: 'app-risk-calc-advanced',
  templateUrl: './risk-calc-advanced.component.html',
  styleUrls: ['./risk-calc-advanced.component.scss'],
})
export class RiskCalcAdvancedComponent implements OnInit {
  public constructor(
    private riskCalcService: RiskCalcService,
  ) {
  }

  public ngOnInit() {}

  public formDataChanged(data: RiskIncomeData): void {
    this.riskCalcService.calculateTrade(data);
  }
}

