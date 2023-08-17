import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {Enter, F1, F2, F3, isKey_Enter_Escape, isKey_F1_F12_Enter_Escape, isKey_F1_F4_Enter} from "../localdata/keys";

@Directive({
  selector: '[navKeyDownDirective]'
})
export class NavKeyDownDirective {

  @Input() nextRef: ElementRef | undefined
  @Input() nextRef2: ElementRef | undefined

  constructor(
    private elemRef: ElementRef,
  ) {}

  @HostListener('keydown', ['$event']) onKeyDownHandler(e: KeyboardEvent) {

    const ek = e.key
    const id = this.elemRef.nativeElement.id

    if (isKey_F1_F12_Enter_Escape(ek) &&
      //для ниже перечисленных условый стандартное поведение НЕ будет переопределяться
      id !== "loginButton"
    ) {
      //переопределить стандартное поведение
      e.preventDefault()
    }

    if (isKey_Enter_Escape(ek)) {
      if (ek === Enter)
        this.nextRef?.nativeElement.focus()
      else {
        const nr2ne = this.nextRef2?.nativeElement
        if (nr2ne !== undefined) nr2ne.focus()
      }
    }

  }

}
