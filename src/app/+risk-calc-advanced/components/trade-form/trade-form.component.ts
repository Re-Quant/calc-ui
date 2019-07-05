import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TradeFormService } from './trade-form.service';
import { TradeFormValidatorsService } from '../../services/trade-form-validators.service';
import { RiskIncomeFormData } from '../../models';
import { TradeInfoArgs } from '@z-brain/calc';

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
  @Output()
  public dataChange = new EventEmitter<TradeInfoArgs>();

  constructor(
    private tradeFormService: TradeFormService,
  ) { }

  get form(): FormGroup {
    return this.tradeFormService.form;
  }

  ngOnInit() {
    this.onChange();
  }

  public onChange(): void {
    if (this.form.valid) {
      const value: RiskIncomeFormData = this.form.value;
      const data: TradeInfoArgs = this.tradeFormService.convertToTradeInfoArgs(value);

      this.dataChange.emit(data);
    } else {
      console.log('invalid form');
    }
  }

  public addOrderItemAbove(entity: string, index: number) {
    this.tradeFormService.addOrderItemAbove(entity, index);
    this.onChange();
  }

  public addOrderItemBelow(entity: string, index: number) {
    this.tradeFormService.addOrderItemBelow(entity, index);
    this.onChange();
  }

  public removeOrderItem(entity: string, index: number) {
    this.tradeFormService.removeOrderItem(entity, index);
    this.onChange();
  }

  public onSetOrderItemPercentage(data: { value: string; item: FormGroup }) {
    this.tradeFormService.setOrderItemPercentage(data);
    this.onChange();
  }

  public equalizePercentage(entity: string) {
    this.tradeFormService.equalizePercentage(entity);
    this.onChange();
  }
}
