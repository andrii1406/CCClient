import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {KursesModel} from "../kurses.model";
import {CurrenciesModel} from "../../currencies/currencies.model";

@Component({
  selector: 'kurses-prev-modal',
  templateUrl: './kurses-prev-modal.component.html',
  styleUrls: ['./kurses-prev-modal.component.scss']
})
export class KursesPrevModalComponent {

  private _data0: KursesModel[] = []
  private _data1: KursesModel[] = []
  private _data2: KursesModel[] = []
  private _data3: CurrenciesModel[] = []

  @Output() modalYes = new EventEmitter<void>()
  @Output() modalNo = new EventEmitter<void>()

  @ViewChild('lKrs0') lKrs0Ref: ElementRef | undefined
  @ViewChild('lKrs1') lKrs1Ref: ElementRef | undefined
  @ViewChild('lKrs2') lKrs2Ref: ElementRef | undefined
  @ViewChild('lKrs3') lKrs3Ref: ElementRef | undefined

  listRows = 12

  constructor() {}

  get data0(): KursesModel[] {
    return this._data0;
  }

  set data0(value: KursesModel[]) {
    this._data0 = value;
  }

  get data1(): KursesModel[] {
    return this._data1;
  }

  set data1(value: KursesModel[]) {
    this._data1 = value;
  }

  get data2(): KursesModel[] {
    return this._data2;
  }

  set data2(value: KursesModel[]) {
    this._data2 = value;
  }

  get data3(): CurrenciesModel[] {
    return this._data3;
  }

  set data3(value: CurrenciesModel[]) {
    this._data3 = value;
  }

  spliceData() {
    this._data0.splice(0)
    this._data1.splice(0)
    this._data2.splice(0)
    this._data3.splice(0)
  }

  krsOut(value: number ): string {
    return value === 0 ? '.' : String(value)
  }

  listOnChange(ref: ElementRef | undefined) {
    if (ref) {
      const ind = ref.nativeElement.selectedIndex
      if (this.lKrs0Ref) this.lKrs0Ref.nativeElement.selectedIndex = ind
      if (this.lKrs3Ref) this.lKrs3Ref.nativeElement.selectedIndex = ind
      if (this.lKrs1Ref) this.lKrs1Ref.nativeElement.selectedIndex = ind
      if (this.lKrs2Ref) this.lKrs2Ref.nativeElement.selectedIndex = ind
    }
  }

}
