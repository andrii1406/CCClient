import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OstatkiRoutingModule} from "./ostatki-routing.module";
import {OstatkiComponent} from "./component/ostatki.component";
import {ReactiveFormsModule} from "@angular/forms";
import {OstKeyDownDirective} from "./ost-key-down.directive";

@NgModule({
  declarations: [
    OstatkiComponent,
    OstKeyDownDirective,
  ],
  exports: [
    OstKeyDownDirective
  ],
  imports: [
    CommonModule,
    OstatkiRoutingModule,
    ReactiveFormsModule
  ]
})
export class OstatkiModule { }
