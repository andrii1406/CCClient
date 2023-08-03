import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrihRashComponent} from "./components/prih-rash/prih-rash.component";
import {PriemProdComponent} from "./components/priem-prod/priem-prod.component";
import {MainComponent} from "./components/main/main.component";
import {canActivateTab} from "./services/jwt/auth.guard";
import {KursesComponent} from "./components/kurses/kurses.component";

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'opr', component: PrihRashComponent, canActivate: [canActivateTab], },
  { path: 'obm', component: PriemProdComponent, canActivate: [canActivateTab] },
  { path: 'krs', component: KursesComponent, canActivate: [canActivateTab] },
  { path: 'ost', canActivate: [canActivateTab],
    loadChildren: () => import('./ostatki/ostatki.module').then(m => m.OstatkiModule)},
  { path: 'bal', component: MainComponent, canActivate: [canActivateTab] },
  { path: 'fil', component: MainComponent, canActivate: [canActivateTab] },
  { path: 'vob', component: MainComponent, canActivate: [canActivateTab] },
  { path: 'tot', component: MainComponent, canActivate: [canActivateTab] },
  { path: 'vub', component: MainComponent, canActivate: [canActivateTab] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
