import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrencyPage } from './currency';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import exporting from 'highcharts/modules/exporting.src'
import highstock from 'highcharts/modules/stock.src'

@NgModule({
  declarations: [
    CurrencyPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrencyPage),
    ChartModule
  ],
  providers: [{
    provide: HIGHCHARTS_MODULES,
    useFactory: highchartsModules
  }]
})
export class CurrencyPageModule {}

export function highchartsModules() {
  return [ exporting, highstock ];
}
