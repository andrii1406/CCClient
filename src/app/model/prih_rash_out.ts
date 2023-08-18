import {kstat_filial} from "./kstat_filial";
import {CurrenciesModel} from "../currencies/currencies.model";
import {PrOperationsModel} from "../pr_operations/pr_operations.model";

export class prih_rash_out {

  id: number
  npo: number
  pr: PrOperationsModel
  sm: number
  vl: CurrenciesModel
  dt: Date
  kf: kstat_filial
  prim: string
  fl: boolean
  dts: Date

  constructor(id: number, npo: number, pr: PrOperationsModel, sm: number, vl: CurrenciesModel,
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
