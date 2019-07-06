import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { TradeInfo, TradeInfoArgs } from '@z-brain/calc';

import { TradeFormService } from './trade-form.service';
import { TradeFormValidatorsService } from './trade-form-validators.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AddOrderEvent } from './orders-panel/orders-panel.component';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.scss'],
  providers: [
    TradeFormService,
    TradeFormValidatorsService,
  ],
  exportAs: 'tradeForm',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeFormComponent implements OnInit, OnDestroy {
  @Output()
  public dataChange = new EventEmitter<TradeInfoArgs>();

  @Input()
  public tradeInfo?: TradeInfo;

  // @todo: remove `form` from here. Used just for debug.
  public get form(): FormGroup { return this.tradeFormService.form; }
  public get commonSubForm()   { return this.tradeFormService.commonSubForm; }
  public get entriesSubForm()  { return this.tradeFormService.entriesSubForm; }
  public get stopsSubForm()    { return this.tradeFormService.stopsSubForm; }
  public get takesSubForm()    { return this.tradeFormService.takesSubForm; }

  public constructor(
    private tradeFormService: TradeFormService,
  ) {}

  public ngOnInit() {
    this.tradeFormService.tradeInfo$.pipe(untilDestroyed(this)).subscribe(this.dataChange);
  }

  public ngOnDestroy() {}

  public addOrder(form: FormArray, { index, place }: AddOrderEvent) {
    this.tradeFormService.addOrder({ form, index, place });
  }

  public removeOrderItem(form: FormArray, index: number) {
    this.tradeFormService.removeOrderItem(form, index);
  }

  public onSetOrderItemPercentage(data: { value: string; item: FormGroup }) {
    this.tradeFormService.setOrderItemPercentage(data);
  }

  public equalizePercentage(form: FormArray) {
    this.tradeFormService.equalizePercentage(form);
  }
}
