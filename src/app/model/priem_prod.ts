import {currency} from "./currency";
import {pp_obmen} from "./pp_obmen";

export class priem_prod {

  id: number
  np: number
  pp: pp_obmen
  sm: number
  vl: currency
  krs: number
  dt: Date
  fl: boolean
  dts: Date

  constructor(id: number, np: number, pp: pp_obmen, sm: number, vl: currency,
              krs: number, dt: Date, fl: boolean, dts: Date) {
    this.id = id
    this.np = np
    this.pp = pp
    this.sm = sm
    this.vl = vl
    this.krs = krs
    this.dt = dt
    this.fl = fl
    this.dts = dts
  }

}
