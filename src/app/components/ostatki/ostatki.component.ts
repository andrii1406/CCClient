import { Component } from '@angular/core';
import {ostatki} from "../../model/ostatki";
import {currency} from "../../model/currency";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {AuthService} from "../../services/jwt/auth.service";
import {OstatkiService} from "../../services/ostatki.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ppVlLocal} from "../../localdata/currencies";
import {ostatkiLocal} from "../../localdata/ostatki";

@Component({
  selector: 'app-ostatki',
  templateUrl: './ostatki.component.html',
  styleUrls: ['./ostatki.component.scss']
})
export class OstatkiComponent {

  ost: ostatki[] = ostatkiLocal
  ppVl: currency[] = ppVlLocal

  formListOst = new FormGroup({
    ost: new FormControl<ostatki | null>(this.ost[0], []),
  })

  constructor(
    private ostService: OstatkiService,
    private lpService: LoginParamsService,
    private authService: AuthService,
  ) {}

  onTest() {
    const test = new ostatki(null, 10, new currency(4, 'UAH'), 123.99, new Date(), false)
    console.log('test = ',test)

    this.ostService.create(test).subscribe((httpResponse) => {
      if (httpResponse) console.log('httpResponse = ',httpResponse)
    })
  }

}
