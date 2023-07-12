import {pr_operation} from "./pr_operation";
import {currency} from "./currency";
import {kstat_filial} from "./kstat_filial";

export class prih_rash_out {

  id: number
  npo: number
  pr: pr_operation
  sm: number
  vl: currency
  dt: Date
  kf: kstat_filial
  prim: string
  fl: boolean
  dts: Date

  constructor(id: number, npo: number, pr: pr_operation, sm: number, vl: currency,
              dt: Date, kf: kstat_filial, prim: string, fl: boolean, dts: Date) {
    this.id = id
    this.npo = npo
    this.pr = pr
    this.sm = sm
    this.vl = vl
    this.dt = dt
    this.kf = kf
    this.prim = prim
    this.fl = fl
    this.dts = dts
  }

}
