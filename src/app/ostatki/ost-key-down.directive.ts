import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {
  isKey_Enter_Escape,
  isKey_F1_F12_Enter_Escape,
  Enter, F1, F2, F3, F4, F5, F6, Delete
} from "../localdata/keys";
import {CurrencyService} from "../services/currency.service";

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
    private curService: CurrencyService,
  ) {}

  @HostListener('keydown', ['$event']) onKeyDownHandler(e: KeyboardEvent) {

    const ek = e.key
    const id = this.elemRef.nativeElement.id
    const nrne = this.nextRef?.nativeElement
    const nr2ne = this.nextRef2?.nativeElement
    const nrdel = this.nextRefDel?.nativeElement

    if (isKey_F1_F12_Enter_Escape(ek) &&
      id !== "ostDelButton" && id !== "ostUpdButton" && id !== "ostAddButton"
    ) {
      // Prevent default behavior excluding above id's
      e.preventDefault()
    }

    if ((id === "nOstVl") && isKey_F1_F12_Enter_Escape(ek)) {
      const ostVl = this.curService.prVlLocal
      if (ek === F1) this.formCon?.setValue(ostVl[0])
      if (ek === F2) this.formCon?.setValue(ostVl[1])
      if (ek === F3) this.formCon?.setValue(ostVl[2])
      if (ek === F4) this.formCon?.setValue(ostVl[3])
      if (ek === F5) this.formCon?.setValue(ostVl[4])
      if (ek === F6) this.formCon?.setValue(ostVl[5])
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
