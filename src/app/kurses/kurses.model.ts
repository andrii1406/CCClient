import {pp_obmen} from "../model/pp_obmen";
import {currency} from "../model/currency";

export class KursesModel {

  id: number | null
  np: number
  tv: number
  pp: pp_obmen
  vl: currency
  krs: number
  dt: Date
  fl: boolean

  constructor(id: number | null, np: number, tv: number, pp: pp_obmen, vl: currency, krs: number, dt: Date, fl: boolean) {
    this.id = id
    this.np = np
    this.tv = tv
    this.pp = pp
    this.vl = vl
    this.krs = krs
    this.dt = dt
    this.fl = fl
  }

}
