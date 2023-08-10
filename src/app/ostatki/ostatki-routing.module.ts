import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OstatkiComponent} from "./component/ostatki.component";

const routes: Routes = [
  {
    path: '',
    component: OstatkiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OstatkiRoutingModule { }
