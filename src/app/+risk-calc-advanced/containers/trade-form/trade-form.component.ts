import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TradeFormService } from '../../services/trade-form.service';
import { TradeFormValidatorsService } from '../../services/trade-form-validators.service';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.scss'],
  providers: [
    TradeFormService,
    TradeFormValidatorsService,
  ]
})
export class TradeFormComponent implements OnInit {
  constructor(
    private tradeFormService: TradeFormService,
  ) { }

  get form(): FormGroup {
    return this.tradeFormService.form;
  }

  public ngOnInit() {
  }

  public onChange() {

  }
}
