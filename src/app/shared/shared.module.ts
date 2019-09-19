import { NgModule } from '@angular/core';
import { FormComponentsModule } from './form-components';

@NgModule({
  imports: [
    FormComponentsModule
  ],
  exports: [
    FormComponentsModule
  ],
})
export class SharedModule {
}
