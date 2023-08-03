import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OstatkiRoutingModule} from "./ostatki-routing.module";
import {OstatkiComponent} from "./ostatki/ostatki.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    OstatkiRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OstatkiComponent]
})
export class OstatkiModule { }
