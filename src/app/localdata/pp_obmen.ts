import {PpObmensModel} from "../pp_obmens/pp_obmens.model";

export let ppObLocal: PpObmensModel[] = []
export let krsObLocal: PpObmensModel[] = []

export const getKrsObLocalById = (id: number): PpObmensModel | null => {
  let res: PpObmensModel | null = null

  krsObLocal.forEach((value) => {
    if (id === value.id) res = value
  })

  return res
}
