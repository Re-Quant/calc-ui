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

  public convertToTradeInfoArgs({ common, entries, stops, takes }: TradeFormData): TradeInfoArgs {
    return {
      deposit: +common.deposit,
      risk: +common.risk / 100,

      leverage: {
        allow: !!+common.leverageAvailable,
        max: +common.maxLeverage,
      },

      tradeType: common.tradeType,

      breakeven: {
        fee: this.getBreakevenFee(common),
      },

      entries: this.formatOrderData(entries, common),
      stops: this.formatOrderData(stops, common),
      takes: this.formatOrderData(takes, common),

      maxTradeVolumeQuoted: +common.maxTradeVolumeQuoted,
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
