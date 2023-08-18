import {CurrenciesModel} from "../currencies/currencies.model";
import {PpObmensModel} from "../pp_obmens/pp_obmens.model";

export class KursesModel {

  id: number | null
  np: number
  tv: number
  pp: PpObmensModel
  vl: CurrenciesModel
  krs: number
  dt: Date
  fl: boolean

  constructor(id: number | null, np: number, tv: number, pp: PpObmensModel, vl: CurrenciesModel, krs: number, dt: Date, fl: boolean) {
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
