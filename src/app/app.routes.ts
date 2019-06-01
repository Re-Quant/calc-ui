import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'risk-calc-old',
        loadChildren: './+risk-calc#RiskCalcModule',
    },
    {
      path: 'risk-calc-advanced',
      loadChildren: './+risk-calc-advanced#RiskCalcAdvancedModule',
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'risk-calc-advanced',
    },
];
