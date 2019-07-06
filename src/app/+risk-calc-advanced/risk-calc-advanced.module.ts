import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';

import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';

import { routes } from './risk-calc-advanced.routes';
import { RiskCalcAdvancedComponent } from './risk-calc-advanced.component';
import { TradeFormModule } from './../widgets/trade-form/trade-form.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    CdkTableModule,
    FlexLayoutModule,

    TradeFormModule,
  ],
  exports: [],
  declarations: [
    RiskCalcAdvancedComponent,
    ...containers,
    ...components,
    ...pipes,
  ],
  providers: [],
})
export class RiskCalcAdvancedModule {
}
