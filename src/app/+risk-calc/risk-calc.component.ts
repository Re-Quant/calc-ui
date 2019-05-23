import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CalculatedData, RiskIncomeData } from './models';
import { CalcService } from './services/calc.service';

@Component({
  selector: 'app-risk-calc',
  templateUrl: './risk-calc.component.html',
  styleUrls: ['./risk-calc.component.scss'],
})
export class RiskCalcComponent implements OnInit {

  public data$: Observable<CalculatedData | undefined>;

  public constructor(
    private calc: CalcService,
  ) {
  }

  public ngOnInit() {
    this.data$ = this.calc.data$;

    this.calc.data$.subscribe((data) => {
      console.table(data.pricePoints);
      console.table(data);
    });
  }

  public formDataChanged(data: RiskIncomeData): void {
    this.calc.updateData(data);
  }

}

