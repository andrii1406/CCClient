import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {canActivateTab} from "./services/jwt/auth.guard";
import {MainComponent} from "./components/main/main.component";
import {PriemProdComponent} from "./priem-prod/component/priem-prod.component";

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'opr', canActivate: [canActivateTab],
    loadChildren: () => import('./prih-rash/prih-rash.module').then(m => m.PrihRashModule)},
  { path: 'obm', component: PriemProdComponent, canActivate: [canActivateTab],
    loadChildren: () => import('./priem-prod/priem-prod.module').then(m => m.PriemProdModule)},
  { path: 'krs', canActivate: [canActivateTab],
    loadChildren: () => import('./kurses/kurses.module').then(m => m.KursesModule)},
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
