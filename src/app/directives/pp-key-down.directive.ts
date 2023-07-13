import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {currency} from "../model/currency";
import {FormControl} from "@angular/forms";
import {ppVlLocal} from "../localdata/currencies";
import {pp_obmen} from "../model/pp_obmen";
import {ppObLocal} from "../localdata/pp_obmen";
import {PpNewRecService} from "../services/new-operation/pp-new-rec.service";
import {PpGridService} from "../services/ag-grid/pp-grid.service";
import {
  isKey_Enter_Tab,
  isKey_F1_F2_Enter,
  isKey_F1_F4_Enter,
  isKey_F1_F12_Enter_Escape,
  F1, F2, F3, F4, Tab, Enter, Escape
} from "../localdata/keys";
import {ppField, prField} from "../localdata/grid_constants";

@Directive({
  selector: '[ppKeyDownDirective]'
})
export class PpKeyDownDirective {

  focusCol = ppField[2]
  ppOb: pp_obmen[] = ppObLocal
  ppVl: currency[] = ppVlLocal

  @Input() prevRef: ElementRef | undefined
  @Input() nextRef: ElementRef | undefined
  @Input() nextRef2: ElementRef | undefined
  @Input() nextRefDel: ElementRef | undefined
  @Input() formCon: FormControl | undefined

  constructor(
    private elemRef: ElementRef,
    private ppNewRec: PpNewRecService,
    private ppGridService: PpGridService,
  ) {}

  @HostListener('keydown', ['$event']) onKeyDownHandler(e: KeyboardEvent) {

    const ek = e.key
    const id = this.elemRef.nativeElement.id
    const nrne = this.nextRef?.nativeElement
    const nr2ne = this.nextRef2?.nativeElement


    if (isKey_F1_F12_Enter_Escape(ek) &&
      //для ниже перечисленных условый стандартное поведение НЕ будет переопределяться
      id !== "ppSubmButton" && id !== "ppUpdButton" &&
      id !== "ppDelButton" && id !== "ppCancButton"
    ) {
      //переопределить стандартное поведение
      e.preventDefault()
    }

    if ((id === "ppList") && isKey_F1_F2_Enter(ek)) {
      if (ek === F1) this.formCon?.setValue(this.ppOb[0])
      if (ek === F2) this.formCon?.setValue(this.ppOb[1])
      nrne.focus()
    }

    if ((id === "ppVlList") && isKey_F1_F4_Enter(ek)) {
      if (ek === F1) this.formCon?.setValue(this.ppVl[0])
      if (ek === F2) this.formCon?.setValue(this.ppVl[1])
      if (ek === F3) this.formCon?.setValue(this.ppVl[2])
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