import {currency} from "../model/currency";
import {getKrsObLocalById} from "./pp_obmen";
import {KursesModel} from "../kurses/kurses.model";

export let kurses0Local: KursesModel[] = []
export let kurses1Local: KursesModel[] = []
export let kurses2Local: KursesModel[] = []
export let kurses3Local: currency[] = []

export const getKrsVlLocalById = (id: number): currency | null => {
  let res: currency | null = null

  kurses3Local.forEach((value) => {
    if (id === value.id) res = value
  })

  return res
}

export const getArrayPointer = (ppId: number | undefined): KursesModel[] | null => {
  let res = null

  if(ppId === 0) res = kurses0Local
  if(ppId === 1) res = kurses1Local
  if(ppId === 2) res = kurses2Local

  return res
}

export const getIndexInVlLocalById = (id: number): number => {
  let ind = -1

  kurses3Local.forEach((value, index) => {
    if (id === value.id) ind = index
  })

  return ind
}

export const kursesLocalSplice = (): void => {
  kurses3Local.splice(0)
  kurses0Local.splice(0)
  kurses1Local.splice(0)
  kurses2Local.splice(0)
}

export const kursesToLocals = (rbA: KursesModel[]): void => {
  rbA.forEach((rbAValue) => {
    let ind = getIndexInVlLocalById(rbAValue.vl.id)

    if (ind < 0) {
      kurses3Local.push(rbAValue.vl)
      kurses0Local.push(new KursesModel(null, 0, 0, getKrsObLocalById(0)!, rbAValue.vl, 0, rbAValue.dt, false))
      kurses1Local.push(new KursesModel(null, 0, 0, getKrsObLocalById(1)!, rbAValue.vl, 0, rbAValue.dt, false))
      kurses2Local.push(new KursesModel(null, 0, 0, getKrsObLocalById(2)!, rbAValue.vl, 0, rbAValue.dt, false))
      ind = kurses3Local.length - 1
    }

    const ap = getArrayPointer(rbAValue.pp.id)
    if (ap) ap[ind] = rbAValue
  })
}
