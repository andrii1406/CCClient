import {Component, ElementRef, ViewChild} from '@angular/core';
import {currency} from "../../model/currency";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {AuthService} from "../../services/jwt/auth.service";
import {OstatkiService} from "../ostatki.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {prVlLocal} from "../../localdata/currencies";
import {sumRegExp} from "../../localdata/patterns";
import {OstatkiModel} from "../ostatki.model";

@Component({
  selector: 'app-ostatki',
  templateUrl: './ostatki.component.html',
  styleUrls: ['./ostatki.component.scss']
})
export class OstatkiComponent {

  prVl: currency[] = prVlLocal

  // Balances list form (from database)
  formListOst = new FormGroup({
    ost: new FormControl<OstatkiModel | null>(null, []),
  })

  // New balance form
  formUpdOst = new FormGroup({
    id: new FormControl<number | null>(null, []),
    np: new FormControl<number | null>(null, []),
    vl: new FormControl<currency | null>(null, []),
    ost: new FormControl<number | null>(0, [Validators.required, Validators.pattern(sumRegExp)]),
    dt: new FormControl<Date | null>(null, []),
    fl: new FormControl<boolean | null>(null, []),
  })

  // Form for updating selected balance
  formNewOst = new FormGroup({
    id: new FormControl<number | null>(null, []),
    np: new FormControl<number | null>(null, []),
    vl: new FormControl<currency | null>(null, []),
    ost: new FormControl<number | null>(0, [Validators.required, Validators.pattern(sumRegExp)]),
    dt: new FormControl<Date | null>(null, []),
    fl: new FormControl<boolean | null>(false, []),
  })

  lastSelectedOst = -1

  @ViewChild('lOst') lOstRef: ElementRef | undefined

  constructor(
    public ostService: OstatkiService,
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

  // New balance handler
  submitOst() {
    this.formNewOst.controls.dt.setValue(this.lpService.dtTm)
    this.formNewOst.controls.np.setValue(this.lpService.npo)
    const ostNew = {...<OstatkiModel>this.formNewOst.value}

    this.ostService.create(ostNew).subscribe(() => {
    })
  }

  // Handler for event of balances list changing
  onChangeList(ref: ElementRef | undefined) {
    if (ref !== undefined && ref !== null) {
      const refNe = ref.nativeElement

      if (refNe !== undefined && refNe !== null) {
        const index = refNe.selectedIndex

        if (index >= 0) {
          this.lastSelectedOst = index
          const fcVal = this.formListOst.controls.ost.value
          // Set selected balance into the update form
          if (fcVal) this.formUpdOst.setValue(fcVal)
        }
      }
    }
  }

}
