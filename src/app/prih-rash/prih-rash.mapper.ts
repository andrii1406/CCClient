import {Injectable} from "@angular/core";
import {KstatsFilialsModel} from "../kstats_filials/kstats_filials.model";
import {KstatsModel} from "../kstats/kstats.model";
import {PrihRashModel} from "./prih-rash.model";
import {PrihRashAg} from "./prih-rash.ag";

@Injectable({
  providedIn: 'root'
})
export class PrihRashMapper {

  // Convert PrihRashAg into PrihRashModel
  public mapToEntity(out: PrihRashAg): PrihRashModel {

    let Npk = out.kf.npk
    let eKstatId = 0
    let eKstatStat = ''

    if (out.kf.id >= 0) {
      Npk = out.npo
      eKstatId = out.kf.id
      eKstatStat = out.kf.stat_cn
    }

    return new PrihRashModel(
      out.id,
      out.npo,
      out.pr,
      out.sm,
      out.vl,
      Npk,
      out.dt,
      new KstatsModel(eKstatId, eKstatStat),
      out.prim,
      out.fl,
      out.dts
    )

  }

  // Convert PrihRashModel into PrihRashAg
  public mapToOut(e: PrihRashModel): PrihRashAg {

    let outKfId = e.kstat.id
    let outKfNpk = e.npo
    let outKfStat_cn = e.kstat.stat

    if (e.npo !== e.npk) {
      outKfId = -e.npk
      outKfNpk = e.npk
      outKfStat_cn = String(e.npk)
    }

    return new PrihRashAg(
      e.id,
      e.npo,
      e.pr,
      e.sm,
      e.vl,
      e.dt,
      new KstatsFilialsModel(outKfId, outKfStat_cn, outKfNpk),
      e.prim,
      e.fl,
      e.dts
    )

  }

  // Convert PrihRashModel[] into PrihRashAg[]
  public arrayToOut(e: PrihRashModel[]): PrihRashAg[] {
    let out: PrihRashAg[] = []

    e.forEach((value) => out.push(this.mapToOut(value)))

    return out
  }

}
