import {currency} from "../model/currency";

export class OstatkiModel {

  id: number | null
  np: number
  vl: currency
  ost: number
  dt: Date
  fl: boolean

  constructor(id: number | null, np: number, vl: currency, ost: number, dt: Date, fl: boolean) {
    this.id = id;
    this.np = np;
    this.vl = vl;
    this.ost = ost;
    this.dt = dt;
    this.fl = fl;
  }

}
