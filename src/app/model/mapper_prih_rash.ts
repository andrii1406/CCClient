import {prih_rash} from "./prih_rash";
import {prih_rash_out} from "./prih_rash_out";
import {Injectable} from "@angular/core";
import {KstatsFilialsModel} from "../kstats_filials/kstats_filials.model";
import {KstatsModel} from "../kstats/kstats.model";

@Injectable({
  providedIn: 'root'
})
export class Mapper_prih_rash {

  //функция преобразования prih_rash_out в prih_rash
  public mapToEntity(out: prih_rash_out): prih_rash {

    let Npk = out.kf.npk
    let eKstatId = 0
    let eKstatStat = ''

    if (out.kf.id >= 0) {
      Npk = out.npo
      eKstatId = out.kf.id
      eKstatStat = out.kf.stat_cn
    }

    return new prih_rash(
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

  //функция преобразования prih_rash в prih_rash_out
  public mapToOut(e: prih_rash): prih_rash_out {

    let outKfId = e.kstat.id
    let outKfNpk = e.npo
    let outKfStat_cn = e.kstat.stat

    if (e.npo !== e.npk) {
      outKfId = -e.npk
      outKfNpk = e.npk
      outKfStat_cn = String(e.npk)
    }

    return new prih_rash_out(
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

  //функция преобразования массива prih_rash в массив prih_rash_out
  public arrayToOut(e: prih_rash[]): prih_rash_out[] {
    let out: prih_rash_out[] = []

    e.forEach((value) => out.push(this.mapToOut(value)))

    return out
  }

}
