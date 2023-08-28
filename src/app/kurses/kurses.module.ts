import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {KursesComponent} from "./component/kurses.component";
import {KursesRoutingModule} from "./kurses-routing.module";
import {KrsKeyDownDirective} from "./krs-key-down.directive";
import {AppModule} from "../app.module";
import {KursesPrevModalComponent} from "./kurses-prev-modal/kurses-prev-modal.component";

@NgModule({
  declarations: [
    KursesComponent,
    KrsKeyDownDirective,
    KursesPrevModalComponent,
  ],
  exports: [
    KrsKeyDownDirective,
  ],
    imports: [
        CommonModule,
        KursesRoutingModule,
        ReactiveFormsModule,
    ]
})
export class KursesModule { }
