import {currency} from "../model/currency";

export let prVlLocal: currency[] = []
export let ppVlLocal: currency[] = []

export const getVlLocalById = (id: number): currency | null => {
  let res: currency | null = null

  ppVlLocal.forEach((value) => {
    if (id === value.id) res = value
  })

  return res
}
