import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { PercentageComponent } from './percentage.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  declarations: [
    PercentageComponent,
  ],
  exports: [
    PercentageComponent
  ],
})
export class PercentageModule {
}
