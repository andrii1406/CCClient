import {Component, EventEmitter, Input, Output} from '@angular/core';
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

  listRows = 12

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

  constructor() {}

  spliceData() {
    this._data0.splice(0)
    this._data1.splice(0)
    this._data2.splice(0)
    this._data3.splice(0)
  }

  krsOut(value: number ): string {
    return value === 0 ? '.' : String(value)
  }

}
