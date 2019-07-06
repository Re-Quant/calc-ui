import { Injectable } from '@angular/core';

import { distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { TradeInfoArgs, TradeOrderArg } from '@z-brain/calc';

import { TradeFormService } from './trade-form.service';
import { CommonFormData, OrderFormData, TradeFormData, TypeFee } from './trade-form.models';

@Injectable()
export class TradeInfoDataService {

  public tradeInfo$: Observable<TradeInfoArgs>;

  public constructor(
    private tradeFormService: TradeFormService,
  ) {
    this.initStreams();
  }

  private initStreams(): void {
    this.tradeInfo$ = this.tradeFormService.form.valueChanges.pipe(
      startWith(this.tradeFormService.form.value as TradeFormData),
      filter(() => this.tradeFormService.form.valid),
      distinctUntilChanged((p, q) => _.isEqual(p, q)),
      map((data: TradeFormData) => this.convertToTradeInfoArgs(data)),
      shareReplay(1),
    );
  }

  public convertToTradeInfoArgs(value: TradeFormData): TradeInfoArgs {
    return {
      deposit: +value.common.deposit,
      risk: +value.common.risk / 100,

      leverage: {
        allow: !!+value.common.leverageAvailable,
        max: +value.common.maxLeverage,
      },

      tradeType: value.common.tradeType,

      breakeven: {
        fee: this.getBreakevenFee(value.common),
      },

      entries: this.formatOrderData(value.entries, value.common),
      stops: this.formatOrderData(value.stops, value.common),
      takes: this.formatOrderData(value.takes, value.common),

      maxTradeVolumeQuoted: +value.common.maxTradeVolumeQuoted,
    };
  }

  private formatOrderData(orderInfo: OrderFormData[], commonData: CommonFormData): TradeOrderArg[] {
    return orderInfo
      .filter(v => v.activeOrder)
      .map((item: OrderFormData) => {
        return {
          price: +item.price,
          volumePart: +item.percent / 100,
          fee: this.getOrderFee(item, commonData),
        };
      });
  }

  private getOrderFee(item: OrderFormData, commonData: CommonFormData) {
    if (!commonData.feeEnabled) { return 0; }

    return (item.typeOfFee === TypeFee.marketMaker
            ? +commonData.marketMakerFee
            : +commonData.marketTakerFee) / 100;
  }

  private getBreakevenFee(commonData: CommonFormData) {
    if (!commonData.feeEnabled) { return 0; }

    return (commonData.breakevenOrderType === TypeFee.marketMaker
            ? +commonData.marketMakerFee
            : +commonData.marketTakerFee) / 100;
  }
}
