import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {KursesComponent} from "./kurses/kurses.component";
import {KursesRoutingModule} from "./kurses-routing.module";
import {KrsKeyDownDirective} from "./krs-key-down.directive";

@NgModule({
  declarations: [
    KursesComponent,
    KrsKeyDownDirective,
  ],
  exports: [
    KrsKeyDownDirective
  ],
  imports: [
    CommonModule,
    KursesRoutingModule,
    ReactiveFormsModule
  ]
})
export class KursesModule { }
