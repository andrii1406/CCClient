import {kstat} from "./kstat";
import {CurrenciesModel} from "../currencies/currencies.model";
import {PrOperationsModel} from "../pr_operations/pr_operations.model";

export class prih_rash {

  id: number
  npo: number
  pr: PrOperationsModel
  sm: number
  vl: CurrenciesModel
  npk: number
  dt: Date
  kstat: kstat
  prim: string
  fl: boolean
  dts: Date

  constructor(id: number, npo: number, pr: PrOperationsModel, sm: number, vl: CurrenciesModel,
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
