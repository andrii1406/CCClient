import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {pr_operation} from "../model/pr_operation";
import {pr_op} from "../localdata/pr_operations";
import {currency} from "../model/currency";
import {FormControl} from "@angular/forms";
import {PrNewRecService} from "../services/new-operation/pr-new-rec.service";
import {PrGridService} from "../services/ag-grid/pr-grid.service";
import {
  isKey_Enter_Tab,
  isKey_F1_F2_Enter,
  isKey_F1_F4_Enter,
  isKey_F1_F12_Enter_Escape,
  F1, F2, F3, F4, Tab, Enter, Escape, F5, F6
} from "../localdata/keys";
import {prField} from "../localdata/grid_constants";
import {CurrencyService} from "../services/currency.service";

@Directive({
  selector: '[prKeyDownDirective]'
})
export class PrKeyDownDirective {

  focusCol = prField[2]
  prOp: pr_operation[] = pr_op

  @Input() prevRef: ElementRef | undefined
  @Input() nextRef: ElementRef | undefined
  @Input() nextRef2: ElementRef | undefined
  @Input() nextRefDel: ElementRef | undefined
  @Input() formCon: FormControl | undefined

  constructor(
    private elemRef: ElementRef,
    private prNewRec: PrNewRecService,
    private prGridService: PrGridService,
    private curService: CurrencyService,
  ) {}

  @HostListener('keydown', ['$event']) onKeyDownHandler(e: KeyboardEvent) {

    const ek = e.key
    const id = this.elemRef.nativeElement.id
    const nrne = this.nextRef?.nativeElement
    const nr2ne = this.nextRef2?.nativeElement


    if (isKey_F1_F12_Enter_Escape(ek) &&
      //для ниже перечисленных условый стандартное поведение НЕ будет переопределяться
      id !== "submButton" && id !== "updButton" &&
      id !== "delButton" && id !== "cancButton"
    ) {
      //переопределить стандартное поведение
      e.preventDefault()
    }

    if ((id === "prList") && isKey_F1_F2_Enter(ek)) {
      if (ek === F1) this.formCon?.setValue(this.prOp[0])
      if (ek === F2) this.formCon?.setValue(this.prOp[1])
      nrne.focus()
    }

    if ((id === "vlList") && isKey_F1_F4_Enter(ek)) {
      const prVl = this.curService.prVlLocal
      if (ek === F1) this.formCon?.setValue(prVl[0])
      if (ek === F2) this.formCon?.setValue(prVl[1])
      if (ek === F3) this.formCon?.setValue(prVl[2])
      if (ek === F4) this.formCon?.setValue(prVl[3])
      if (ek === F5) this.formCon?.setValue(prVl[4])
      if (ek === F6) this.formCon?.setValue(prVl[5])
      nrne.focus()
    }

    if ((id === "smEdit" || id === "ksList") && (ek === Enter)) {
      nrne.focus()
    }

    if ((id === "primEdit") && isKey_Enter_Tab(ek)) {
      if (ek === Tab) e.preventDefault()
      if (this.prNewRec.getMode())
        nrne.focus()
      else
        nr2ne.focus()
    }

    if (ek === Escape) {
      if (id === "prList" || id === "prihGrid" || id === "rashGrid") {
        this.prNewRec.setMode(true)
        this.prGridService.FocusCell(this.prGridService.lastSelectedGridApi, this.prGridService.lastSelectedRowIndex, this.focusCol)
      }
      else
        this.prevRef?.nativeElement.focus()
    }

  }

}
