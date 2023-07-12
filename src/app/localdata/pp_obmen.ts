import {pp_obmen} from "../model/pp_obmen";
import {kurses} from "../model/kurses";

export let ppObLocal: pp_obmen[] = []
export let krsObLocal: pp_obmen[] = []

export const getKrsObLocalById = (id: number): pp_obmen | null => {
  let res: pp_obmen | null = null

  krsObLocal.forEach((value) => {
    if (id === value.id) res = value
  })

  return res
}
