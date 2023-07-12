import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FocusService {

  constructor() {}

  SelectAllText(ref: ElementRef | undefined) {
    if (ref !== undefined) ref.nativeElement.select()
  }

  SelectLastChar(ref: ElementRef | undefined) {
    if (ref !== undefined) {
      const ln = ref.nativeElement.value.length
      ref.nativeElement.setSelectionRange(ln - 1, ln)
    }
  }

}
