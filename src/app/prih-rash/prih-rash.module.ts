import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {PrKeyDownDirective} from "./pr-key-down.directive";
import {PrihRashRoutingModule} from "./prih-rash-routing.module";
import {PrihRashComponent} from "./component/prih-rash.component";
import {AgGridModule} from "ag-grid-angular";

@NgModule({
  declarations: [
    PrihRashComponent,
    PrKeyDownDirective,
  ],
  exports: [
    PrKeyDownDirective
  ],
  imports: [
    CommonModule,
    PrihRashRoutingModule,
    ReactiveFormsModule,
    AgGridModule,
  ]
})
export class PrihRashModule { }
