import {Component, ElementRef, ViewChild} from '@angular/core';
import {currency} from "../../model/currency";
import {LoginParamsService} from "../../services/login-params/login-params.service";
import {OstatkiService} from "../ostatki.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {prVlLocal} from "../../localdata/currencies";
import {sumRegExp} from "../../localdata/patterns";
import {OstatkiModel} from "../ostatki.model";
import {FocusService} from "../../services/focus/focus.service";

@Component({
  selector: 'app-ostatki',
  templateUrl: './ostatki.component.html',
  styleUrls: ['./ostatki.component.scss']
})
export class OstatkiComponent {

  prVl: currency[] = prVlLocal

  // Balances list form
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
  @ViewChild('nOstVl') nOstVlRef: ElementRef | undefined
  @ViewChild('updOstEdit') updOstEditRef: ElementRef | undefined
  @ViewChild('newOstEdit') newOstEditRef: ElementRef | undefined
  @ViewChild('ostDelButton') ostDelButtonRef: ElementRef | undefined
  @ViewChild('ostUpdButton') ostUpdButtonRef: ElementRef | undefined
  @ViewChild('ostAddButton') ostAddButtonRef: ElementRef | undefined

  constructor(
    public ostService: OstatkiService,
    private focusService: FocusService,
    private lpService: LoginParamsService,
  ) {}

  ngAfterViewInit() {
    // Initialization of currency names list
    if (this.prVl.length > 3) this.formNewOst.controls.vl.setValue(this.prVl[3])

    // Balances list initialization
    if (this.ostService.ostatkiLocal.length > 0) {
      this.formListOst.controls.ost.setValue(this.ostService.ostatkiLocal[0])
      this.lOstRef?.nativeElement.focus()
    }
  }

  // Balances list - handler of focus event
  onFocusList(ref: ElementRef | undefined) {
    this.onChangeList(ref)
  }

  // Select all characters of currency balance
  onFocusEdit(ref: ElementRef | undefined) {
    this.focusService.SelectAllText(ref)
  }

  // New balance handler
  submitOst() {
    this.formNewOst.controls.dt.setValue(this.lpService.dtTm)
    this.formNewOst.controls.np.setValue(this.lpService.npo)
    const ostNew = {...<OstatkiModel>this.formNewOst.value}
    const ostVal = this.newOstEditRef?.nativeElement.value

    if (ostVal === '0') {
      this.newOstEditRef?.nativeElement.focus()
    }
    else {
      const vl = this.formNewOst.controls.vl.value

      this.ostService.create(ostNew).subscribe(() => {
        this.formNewOst.reset()
        this.formNewOst.controls.vl.setValue(vl)
        this.formNewOst.controls.ost.setValue(0)
        this.nOstVlRef?.nativeElement.focus()
      })
    }
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
