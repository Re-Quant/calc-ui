import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'risk-calc',
        loadChildren: './+risk-calc#RiskCalcModule',
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'risk-calc',
    },
];
