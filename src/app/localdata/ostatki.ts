import {ostatki} from "../model/ostatki";

export let ostatkiLocal: ostatki[] = []

export const getKrsVlLocalById = (id: number): ostatki | null => {
  let res: ostatki | null = null

  ostatkiLocal.forEach((value) => {
    if (id === value.id) res = value
  })

  return res
}
