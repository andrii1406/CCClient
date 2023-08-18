import {CurrenciesModel} from "../currencies/currencies.model";
import {PpObmensModel} from "../pp_obmens/pp_obmens.model";

export class priem_prod {

  id: number
  np: number
  pp: PpObmensModel
  sm: number
  vl: CurrenciesModel
  krs: number
  dt: Date
  fl: boolean
  dts: Date

  constructor(id: number, np: number, pp: PpObmensModel, sm: number, vl: CurrenciesModel,
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
