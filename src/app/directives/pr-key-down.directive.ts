import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {PrNewRecService} from "../services/new-operation/pr-new-rec.service";
import {PrGridService} from "../services/ag-grid/pr-grid.service";
import {
  isKey_Enter_Tab,
  isKey_F1_F2_Enter,
  getIndexInPrByKey,
  isKey_F1_F12_Enter_Escape,
  F1, F2, Tab, Enter, Escape,
} from "../localdata/keys";
import {prField} from "../localdata/grid_constants";
import {CurrencyService} from "../currencies/currency.service";
import {OperationService} from "../services/operation.service";

@Directive({
  selector: '[prKeyDownDirective]'
})
export class PrKeyDownDirective {

  focusCol = prField[2]

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
    private opService: OperationService,
  ) {}

  @HostListener('keydown', ['$event']) onKeyDownHandler(e: KeyboardEvent) {

    const ek = e.key
    const id = this.elemRef.nativeElement.id
    const nrne = this.nextRef?.nativeElement
    const nr2ne = this.nextRef2?.nativeElement
    const fc = this.formCon


    if (isKey_F1_F12_Enter_Escape(ek) &&
      //для ниже перечисленных условый стандартное поведение НЕ будет переопределяться
      id !== "submButton" && id !== "updButton" &&
      id !== "delButton" && id !== "cancButton"
    ) {
      //переопределить стандартное поведение
      e.preventDefault()
    }

    if ((id === "prList") && isKey_F1_F2_Enter(ek)) {
      if (fc !== undefined) {
        const prOp = this.opService.pr_op
        if (ek === F1) fc.setValue(prOp[0])
        if (ek === F2) fc.setValue(prOp[1])
      }
      nrne.focus()
    }

    if ((id === "vlList") && isKey_F1_F12_Enter_Escape(ek)) {
      if (fc !== undefined) {
        const prVl = this.curService.prVlLocal
        const index = getIndexInPrByKey(ek)
        if (index >= 0 && index < prVl.length) fc.setValue(prVl[index])
      }
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
