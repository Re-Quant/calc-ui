import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public addOrderItemAbove(entity: string, index: number) {
    console.log(entity, index);
    this.tradeFormService.addOrderItemAbove(entity, index);
  }

  public addOrderItemBelow(entity: string, index: number) {
    console.log(entity, index);
    this.tradeFormService.addOrderItemBelow(entity, index);
  }

  public removeOrderItem(entity: string, index: number) {
    console.log(entity, index);
    this.tradeFormService.removeOrderItem(entity, index);
  }
}
