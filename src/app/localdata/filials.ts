import {filial} from "../model/filial";

export let filialsLocal: filial[] = []

export const getFilialsLocalById = (id: number): filial | null => {
  let res: filial | null = null

  filialsLocal.forEach((value) => {
    if (id === value.id) res = value
  })

  return res
}
