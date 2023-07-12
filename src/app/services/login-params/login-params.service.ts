import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginParamsService {

  private _npo = 0
  private _tv = 0

  //локальная рабочая дата в тексотовом виде в формате iso 8601 utc - yyyy-MM-dd
  private _dt = ''

  //локальное время в текстовом виде в формате - HH-mm-ss
  private _tm = ''

  //локальная рабочая дата (тип Date) со временем
  private _dtTm = new Date()
  private _dtB = new Date()
  private _dtE = new Date()


  constructor() {}

  initDates(isoBasicDate: string) {
    this._dt = isoBasicDate
    this._tm = new Date().toLocaleTimeString()
    this._dtB = new Date(`${this._dt}T00:00:00.000`)
    this._dtE = new Date(`${this._dt}T23:59:59.999`)
    this._dtTm = new Date(`${this._dt}T${this._tm}`)
  }

  clearNpoAndTv() {
    this._npo = 0
    this._tv = 0
  }

  rememberParams(npo: number | null, tv: number | null, dt: string | null) {
    if (npo) this._npo = npo
    if (tv) this._tv = tv
    if (dt) this._dt = dt
  }

  get npo(): number {
    return this._npo;
  }

  get dt(): string {
    return this._dt;
  }

  get tm(): string {
    return this._tm;
  }

  get dtB(): Date {
    return this._dtB;
  }

  get dtE(): Date {
    return this._dtE;
  }

  set npo(value: number) {
    this._npo = value;
  }

  set dt(value: string) {
    this._dt = value;
  }

  set tm(value: string) {
    this._tm = value;
  }

  set dtB(value: Date) {
    this._dtB = value;
  }

  set dtE(value: Date) {
    this._dtE = value;
  }

  get dtTm(): Date {
    return this._dtTm;
  }

  get tv(): number {
    return this._tv;
  }

  set tv(value: number) {
    this._tv = value;
  }

}
