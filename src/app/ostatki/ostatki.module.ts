import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OstatkiRoutingModule} from "./ostatki-routing.module";
import {OstatkiComponent} from "./ostatki/ostatki.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    OstatkiComponent
  ],
  imports: [
    CommonModule,
    OstatkiRoutingModule,
    ReactiveFormsModule
  ]
})
export class OstatkiModule { }
