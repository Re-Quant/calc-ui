// function tradeType(startPriceControlName, stopPriceControlName, takePriceControlName) {
//   return (AC: AbstractControl) => {
//     const parent = AC.parent;
//
//     if (!parent) {
//       return null;
//     }
//
//     const currentValue = AC.value;
//     const startControl = parent.get(startPriceControlName);
//     const stopControl = parent.get(stopPriceControlName);
//     const takeControl = parent.get(takePriceControlName);
//
//     if (!startControl || !stopControl || !takeControl) {
//       return null;
//     }
//
//     const startControlValue = +startControl.value;
//     const stopControlValue = +stopControl.value;
//     const takeControlValue = +takeControl.value;
//
//     if (currentValue === ETradeType.Long
//       && startControlValue <= stopControlValue) {
//       return {
//         tradePrice: true,
//       };
//     }
//
//     if (currentValue !== ETradeType.Long
//       && startControlValue >= stopControlValue) {
//       return {
//         tradePrice2: true,
//       };
//     }
//
//     if (currentValue === ETradeType.Long
//       && startControlValue >= takeControlValue) {
//       return {
//         tradePrice3: true,
//       };
//     }
//
//     if (currentValue !== ETradeType.Long
//       && startControlValue <= takeControlValue) {
//       return {
//         tradePrice4: true,
//       };
//     }
//
//     return null;
//   };
// }
//
// function startPrice(tradeTypeControlName, stopPriceControlName) {
//   return (AC: AbstractControl) => {
//     const parent = AC.parent;
//
//     if (!parent) {
//       return null;
//     }
//
//     const currentValue = +AC.value;
//     const tradeTypeControl = parent.get(tradeTypeControlName);
//     const stopControl = parent.get(stopPriceControlName);
//
//     if (!tradeTypeControl || !stopControl) {
//       return null;
//     }
//
//     const tradeTypeControlValue = tradeTypeControl.value;
//     const stopControlValue = +stopControl.value;
//
//     if (tradeTypeControlValue === ETradeType.Long
//       && stopControlValue >= currentValue) {
//       return { startIsLessOrEqualStart: true };
//     }
//
//     if (tradeTypeControlValue !== ETradeType.Long
//       && stopControlValue <= currentValue) {
//       return {startIsBiggerOrEqualStart: true};
//     }
//
//     return null;
//   };
// }
//
// function stopPrice(tradeTypeControlName, startPriceControlName) {
//   return (AC: AbstractControl) => {
//     const parent = AC.parent;
//
//     if (!parent) {
//       return null;
//     }
//
//     const currentValue = +AC.value;
//     const tradeTypeControl = parent.get(tradeTypeControlName);
//     const startControl = parent.get(startPriceControlName);
//
//     if (!tradeTypeControl || !startControl) {
//       return null;
//     }
//
//     const tradeTypeControlValue = tradeTypeControl.value;
//     const startControlValue = +startControl.value;
//
//     if (tradeTypeControlValue === ETradeType.Long
//       && startControlValue <= currentValue) {
//       return { stopIsLessOrEqualStart: true };
//     }
//
//     if (tradeTypeControlValue !== ETradeType.Long
//       && startControlValue >= currentValue) {
//       return {stopIsBiggerOrEqualStart: true};
//     }
//
//     return null;
//   };
// }
//
// function takePrice(tradeTypeControlName, startPriceControlName: string) {
//   return (control: AbstractControl) => {
//     const parent = control.parent;
//     if (!parent) {
//       return null;
//     }
//
//     const tradeTypeControl = parent.get(tradeTypeControlName);
//     const startControl = parent.get(startPriceControlName);
//
//     if (!tradeTypeControl || !startControl) {
//       return null;
//     }
//
//     const tradeTypeValue = tradeTypeControl.value;
//     const startValue = +startControl.value;
//     const takeValue = +control.value;
//
//     if (tradeTypeValue === ETradeType.Long && takeValue <= startValue) {
//       return {takeIsLessOrEqualStart: true};
//     }
//     if (tradeTypeValue !== ETradeType.Long && takeValue >= startValue) {
//       return {takeIsBiggerOrEqualStart: true};
//     }
//
//     return null;
//   };
// }

import { Injectable } from '@angular/core';

@Injectable()
export class TradeFormValidatorsService {

}
