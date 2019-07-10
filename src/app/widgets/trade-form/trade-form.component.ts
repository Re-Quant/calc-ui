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
import { untilDestroyed } from 'ngx-take-until-destroy';

import { TradeFormService } from './trade-form.service';
import { TradeFormValidatorsService } from './trade-form-validators.service';
import { TradeInfoDataService } from './trade-info-data.service';
import { AddOrderEvent, MoveOrderEvent } from './trade-form.models';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.scss'],
  providers: [
    TradeFormService,
    TradeInfoDataService,
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
    private tradeInfoDataService: TradeInfoDataService,
  ) {}

  public ngOnInit() {
    this.tradeInfoDataService.tradeInfo$.pipe(untilDestroyed(this)).subscribe(this.dataChange);
  }

  public ngOnDestroy() {}

  public addOrder(form: FormArray, { index, place }: AddOrderEvent) {
    this.tradeFormService.addOrder({ form, index, place });
  }

  public removeOrder(form: FormArray, index: number) {
    this.tradeFormService.removeOrder(form, index);
  }

  public moveOrder(form: FormArray, { index, place }: MoveOrderEvent) {
    console.log('move');
    this.tradeFormService.moveOrder({ form, index, place });
  }

  public onSetOrderPercentage(data: { value: string; item: FormGroup }) {
    this.tradeFormService.setOrderPercentage(data);
  }

  public equalizePercentage(form: FormArray) {
    this.tradeFormService.equalizePercentage(form);
  }
}
