import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OstatkiRoutingModule} from "./ostatki-routing.module";
import {OstatkiComponent} from "./component/ostatki.component";
import {ReactiveFormsModule} from "@angular/forms";
import {OstKeyDownDirective} from "./ost-key-down.directive";
import {AppModule} from "../app.module";
import {ReplaceCommaPipe} from "../pipes/replace-comma.pipe";

@NgModule({
  declarations: [
    OstatkiComponent,
    OstKeyDownDirective,
    ReplaceCommaPipe,
  ],
  exports: [
    OstKeyDownDirective,
    ReplaceCommaPipe
  ],
  imports: [
    CommonModule,
    OstatkiRoutingModule,
    ReactiveFormsModule,
  ]
})
export class OstatkiModule { }
