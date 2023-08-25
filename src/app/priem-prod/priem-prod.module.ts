import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {PpKeyDownDirective} from "./pp-key-down.directive";
import {PriemProdRoutingModule} from "./priem-prod-routing.module";
import {PriemProdComponent} from "./component/priem-prod.component";
import {AgGridModule} from "ag-grid-angular";
import {ReplaceCommaModule} from "../replace-comma/replace-comma.module";

@NgModule({
  declarations: [
    PriemProdComponent,
    PpKeyDownDirective,
  ],
  exports: [
    PpKeyDownDirective
  ],
  imports: [
    CommonModule,
    PriemProdRoutingModule,
    ReactiveFormsModule,
    AgGridModule,
    ReplaceCommaModule,
  ]
})
export class PriemProdModule { }
