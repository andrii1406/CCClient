import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import { PrihRashComponent } from './components/prih-rash/prih-rash.component';
import { PriemProdComponent } from './components/priem-prod/priem-prod.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import {HttpClientModule} from "@angular/common/http";
import {httpInterceptorProviders} from "./services/jwt/auth-interceptor";
import { MainComponent } from './components/main/main.component';
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import {NewOperationService} from "./services/new-operation/new-operation.service";
import {AgGridService} from "./services/ag-grid/ag-grid.service";
import { KursesComponent } from './components/kurses/kurses.component';
import { PrKeyDownDirective } from './directives/pr-key-down.directive';
import { PpKeyDownDirective } from './directives/pp-key-down.directive';
import { KrsKeyDownDirective } from './directives/krs-key-down.directive';
import { NavKeyDownDirective } from './directives/nav-key-down.directive';
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PrihRashComponent,
    PriemProdComponent,
    NavigationComponent,
    KursesComponent,
    PrKeyDownDirective,
    PpKeyDownDirective,
    KrsKeyDownDirective,
    NavKeyDownDirective,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgbModule,
        FormsModule,
        AgGridModule,
    ],
  providers: [
    { provide: LOCALE_ID, useValue: "fr-FR" },
    httpInterceptorProviders,
    NewOperationService,
    AgGridService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
