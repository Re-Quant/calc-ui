import { Component, OnInit } from '@angular/core';
import { zMath, ZMath, zRisk, ZRisk } from '@z-brain/calc';

@Component({
  selector: 'app-risk-calc-advanced',
  templateUrl: './risk-calc-advanced.component.html',
  styleUrls: ['./risk-calc-advanced.component.scss'],
})
export class RiskCalcAdvancedComponent implements OnInit {
  public constructor(
  ) {
  }

  public ngOnInit() {
    console.log('ZMath: .1 + .2 === .3', zMath.eq(.1 + .2, .3));
  }
}

