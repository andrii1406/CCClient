import {pr_operation} from "./pr_operation";
import {currency} from "./currency";
import {kstat} from "./kstat";

export class prih_rash {

  id: number
  npo: number
  pr: pr_operation
  sm: number
  vl: currency
  npk: number
  dt: Date
  kstat: kstat
  prim: string
  fl: boolean
  dts: Date

  constructor(id: number, npo: number, pr: pr_operation, sm: number, vl: currency,
              npk: number, dt: Date, kstat: kstat, prim: string, fl: boolean, dts: Date) {
    this.id = id
    this.npo = npo
    this.pr = pr
    this.sm = sm
    this.vl = vl
    this.npk = npk
    this.dt = dt
    this.kstat = kstat
    this.prim = prim
    this.fl = fl
    this.dts = dts
  }

}
