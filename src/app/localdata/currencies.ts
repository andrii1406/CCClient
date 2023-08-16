import {currency} from "../model/currency";

export let prVlLocal: currency[] = []
export let ppVlLocal: currency[] = []

export const getPpVlLocalById = (id: number): currency | null => {
  return getVlLocalById(id, ppVlLocal)
}

export const getPrVlLocalById = (id: number): currency | null => {
  return getVlLocalById(id, prVlLocal)
}

export const getVlLocalById = (id: number, arr: currency[]): currency | null => {
  let res: currency | null = null

  arr.forEach((value) => {
    if (id === value.id) res = value
  })

  return res
}
