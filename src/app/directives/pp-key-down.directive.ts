import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {PpNewRecService} from "../services/new-operation/pp-new-rec.service";
import {PpGridService} from "../services/ag-grid/pp-grid.service";
import {
  isKey_Enter_Tab,
  isKey_F1_F2_Enter,
  getIndexInPpByKey,
  isKey_F1_F12_Enter_Escape,
  F1, F2, Tab, Enter, Escape,
} from "../localdata/keys";
import {ppField} from "../localdata/grid_constants";
import {CurrencyService} from "../currencies/currency.service";
import {ObmenService} from "../services/obmen.service";

@Directive({
  selector: '[ppKeyDownDirective]'
})
export class PpKeyDownDirective {

  focusCol = ppField[2]

  @Input() prevRef: ElementRef | undefined
  @Input() nextRef: ElementRef | undefined
  @Input() nextRef2: ElementRef | undefined
  @Input() nextRefDel: ElementRef | undefined
  @Input() formCon: FormControl | undefined

  constructor(
    private elemRef: ElementRef,
    private obService: ObmenService,
    private ppNewRec: PpNewRecService,
    private ppGridService: PpGridService,
    private curService: CurrencyService,
  ) {}

  @HostListener('keydown', ['$event']) onKeyDownHandler(e: KeyboardEvent) {

    const ek = e.key
    const id = this.elemRef.nativeElement.id
    const nrne = this.nextRef?.nativeElement
    const nr2ne = this.nextRef2?.nativeElement
    const fc = this.formCon

    if (isKey_F1_F12_Enter_Escape(ek) &&
      //для ниже перечисленных условый стандартное поведение НЕ будет переопределяться
      id !== "ppSubmButton" && id !== "ppUpdButton" &&
      id !== "ppDelButton" && id !== "ppCancButton"
    ) {
      //переопределить стандартное поведение
      e.preventDefault()
    }

    if ((id === "ppList") && isKey_F1_F2_Enter(ek)) {
      if (fc !== undefined) {
        const ppOb = this.obService.pp_ob
        if (ek === F1) fc.setValue(ppOb[0])
        if (ek === F2) fc.setValue(ppOb[1])
      }
      nrne.focus()
    }

    if ((id === "ppVlList") && isKey_F1_F12_Enter_Escape(ek)) {
      if (fc !== undefined) {
        const ppVl = this.curService.ppVlLocal
        const index = getIndexInPpByKey(ek)
        if (index >= 0 && index < ppVl.length) fc.setValue(ppVl[index])
      }
      nrne.focus()
    }

    if ((id === "ppSmEdit") && (ek === Enter)) {
      nrne.focus()
    }

    if ((id === "ppKrsEdit") && isKey_Enter_Tab(ek)) {
      if (ek === Tab) e.preventDefault()
      if (this.ppNewRec.getMode())
        nrne.focus()
      else
        nr2ne.focus()
    }

    if (ek === Escape) {
      if (id === "ppList" || id === "priemGrid" || id === "prodGrid") {
        this.ppNewRec.setMode(true)
        this.ppGridService.FocusCell(this.ppGridService.lastSelectedGridApi, this.ppGridService.lastSelectedRowIndex, this.focusCol)
      }
      else
        this.prevRef?.nativeElement.focus()
    }

  }

}
