import { Component } from '@angular/core';
import {ostatki} from "../../model/ostatki";
import {currency} from "../../model/currency";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {AuthService} from "../../services/jwt/auth.service";
import {OstatkiService} from "../../services/ostatki.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {prVlLocal} from "../../localdata/currencies";
import {ostatkiLocal} from "../../localdata/ostatki";
import {sumRegExp} from "../../localdata/patterns";
import {getIndexInVlLocalById} from "../../localdata/kurses";
import {priem_prod} from "../../model/priem_prod";

@Component({
  selector: 'app-ostatki',
  templateUrl: './ostatki.component.html',
  styleUrls: ['./ostatki.component.scss']
})
export class OstatkiComponent {

  ost: ostatki[] = ostatkiLocal
  prVl: currency[] = prVlLocal

  formListOst = new FormGroup({
    ost: new FormControl<ostatki | null>(null, []),
  })

  formUpdOst = new FormGroup({
    id: new FormControl<number | null>(null, []),
    np: new FormControl<number | null>(null, []),
    vl: new FormControl<currency | null>(null, []),
    ost: new FormControl<number | null>(0, [Validators.required, Validators.pattern(sumRegExp)]),
    dt: new FormControl<Date | null>(null, []),
    fl: new FormControl<boolean | null>(null, []),
  })

  formNewOst = new FormGroup({
    id: new FormControl<number | null>(null, []),
    np: new FormControl<number | null>(null, []),
    vl: new FormControl<currency | null>(null, []),
    ost: new FormControl<number | null>(0, [Validators.required, Validators.pattern(sumRegExp)]),
    dt: new FormControl<Date | null>(null, []),
    fl: new FormControl<boolean | null>(false, []),
  })

  constructor(
    private ostService: OstatkiService,
    private lpService: LoginParamsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    //Initialization of drop-down lists
    this.authService.isLoggedIn$.subscribe((value) => {
      if(value) {
        if (this.prVl.length > 3) this.formNewOst.controls.vl.setValue(this.prVl[3])
      }
    })
  }

  submitOst() {
    this.formNewOst.controls.dt.setValue(this.lpService.dtTm)
    this.formNewOst.controls.np.setValue(this.lpService.npo)
    const ostNew = {...<ostatki>this.formNewOst.value}

    this.ostService.create(ostNew).subscribe(() => {
    })
  }

}
