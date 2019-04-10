import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule  } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { components } from './components';
import { containers } from './containers';
import { pipes } from './pipes';

import { routes } from './risk-calc.routes';
import { RiskCalcComponent } from './risk-calc.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatButtonToggleModule,
    ],
    exports: [],
    declarations: [
        RiskCalcComponent,
        ...components,
        ...containers,
        ...pipes,
    ],
    providers: [ ],
})
export class RiskCalcModule {
}
