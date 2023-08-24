import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {
  getIndexInPrByKey,
  isKey_Enter_Escape,
  isKey_F1_F12_Enter_Escape,
  Enter, Delete,
} from "../localdata/keys";
import {CurrenciesService} from "../currencies/currencies.service";

@Directive({
  selector: '[ostKeyDownDirective]'
})
export class OstKeyDownDirective {

  @Input() nextRef: ElementRef | undefined
  @Input() nextRef2: ElementRef | undefined
  @Input() nextRefDel: ElementRef | undefined
  @Input() formCon: FormControl | undefined

  constructor(
    private elemRef: ElementRef,
    private curService: CurrenciesService,
  ) {}

  @HostListener('keydown', ['$event']) onKeyDownHandler(e: KeyboardEvent) {

    const ek = e.key
    const id = this.elemRef.nativeElement.id
    const nrne = this.nextRef?.nativeElement
    const nr2ne = this.nextRef2?.nativeElement
    const nrdel = this.nextRefDel?.nativeElement
    const fc = this.formCon

    if (isKey_F1_F12_Enter_Escape(ek) &&
      id !== "ostDelButton" && id !== "ostUpdButton" && id !== "ostAddButton"
    ) {
      // Prevent default behavior excluding above id's
      e.preventDefault()
    }

    if ((id === "nOstVl") && isKey_F1_F12_Enter_Escape(ek)) {
      if (fc !== undefined) {
        const prVl = this.curService.prVlLocal
        const index = getIndexInPrByKey(ek)
        if (index >= 0 && index < prVl.length) fc.setValue(prVl[index])
      }
      nrne.focus()
    }

    if (isKey_Enter_Escape(ek)) {
      if (ek === Enter) {
        if (nrne !== undefined) nrne.focus()
      } else {
        if (nr2ne !== undefined) nr2ne.focus()
      }
    }

    if (ek === Delete) {
      if (nrdel !== undefined) nrdel.focus()
    }

  }

}
