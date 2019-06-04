import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';

import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';

import { routes } from './risk-calc-advanced.routes';
import { RiskCalcAdvancedComponent } from './risk-calc-advanced.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,

    CdkTableModule,
    FlexLayoutModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTableModule,
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
