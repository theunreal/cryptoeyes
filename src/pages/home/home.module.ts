import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MatTableModule} from '@angular/material/table';
import {HomePage} from "./home";
import {MatPaginatorModule, MatSortModule} from "@angular/material";

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
})
export class CurrencyPageModule {}
