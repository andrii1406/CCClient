import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {
  isKey_Enter_Escape,
  isKey_F1_F12_Enter_Escape,
  Enter, F1, F2, F3, F5, F6
} from "../localdata/keys";
import {CurrencyService} from "../currencies/currency.service";

@Directive({
  selector: '[krsKeyDownDirective]'
})
export class KrsKeyDownDirective {

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

    if (isKey_F1_F12_Enter_Escape(ek) &&
      //для ниже перечисленных условый стандартное поведение НЕ будет переопределяться
      id !== "krsAddButton" && id !== "krsUpdButton"
    ) {
      //переопределить стандартное поведение
      e.preventDefault()
    }

    if ((id === "nKrs3") && isKey_F1_F12_Enter_Escape(ek)) {
      const krsVl = this.curService.ppVlLocal
      if (ek === F1) this.formCon?.setValue(krsVl[0])
      if (ek === F2) this.formCon?.setValue(krsVl[1])
      if (ek === F3) this.formCon?.setValue(krsVl[2])
      if (ek === F5) this.formCon?.setValue(krsVl[3])
      if (ek === F6) this.formCon?.setValue(krsVl[4])
      nrne.focus()
    }

    if (isKey_Enter_Escape(ek)) {
      if (ek === Enter)
        nrne.focus()
      else
        if (nr2ne !== undefined) nr2ne.focus()
    }

  }

}
