
export const F1 = "F1"
export const F2 = "F2"
export const F3 = "F3"
export const F4 = "F4"
export const F5 = "F5"
export const F6 = "F6"
export const F7 = "F7"
export const F8 = "F8"
export const F9 = "F9"
export const F10 = "F10"
export const F11 = "F11"
export const F12 = "F12"
export const Tab = "Tab"
export const End = "End"
export const Home = "Home"
export const Enter = "Enter"
export const Escape = "Escape"
export const Delete = "Delete"
export const PageUp = "PageUp"
export const PageDown = "PageDown"

// For downed key get index in array with currency 'UAH'
export const getIndexInPrByKey = (k: string): number => {
  let res = -1

  if (k === F1) res = 0
  if (k === F2) res = 1
  if (k === F3) res = 2
  if (k === F4) res = 3
  if (k === F5) res = 4
  if (k === F6) res = 5
  if (k === F7) res = 6
  if (k === F8) res = 7
  if (k === F9) res = 8
  if (k === F10) res = 9
  if (k === F11) res = 10
  if (k === F12) res = 11

  return res
}

// For downed key get index in array without currency 'UAH'
export const getIndexInPpByKey = (k: string): number => {
  let res = -1

  if (k === F1) res = 0
  if (k === F2) res = 1
  if (k === F3) res = 2

  if (k === F5) res = 3
  if (k === F6) res = 4
  if (k === F7) res = 5
  if (k === F8) res = 6
  if (k === F9) res = 7
  if (k === F10) res = 8
  if (k === F11) res = 9
  if (k === F12) res = 10

  return res
}

export const isKey_F1_F12_Enter_Escape = (k: string): boolean => {
  return  isKey_F1_F2(k) || k === F3 || k === F4 || k === F5 || k === F6 || k === F7 ||
          k === F8 || k === F9 || k === F10 || k === F11 || k === F12 || isKey_Enter_Escape(k)
}

export const isKey_Home_End_PageUp_PageDown = (k: string): boolean => {
  return k === Home || k === End || k === PageUp || k === PageDown
}

export const isKey_F1_F2_Enter_Delete = (k: string): boolean => {
  return isKey_F1_F2_Enter(k) || k === Delete
}

export const isKey_F1_F4_Enter = (k: string): boolean => {
  return isKey_F1_F2_Enter(k) || k === F3 || k === F4
}

export const isKey_F1_F2_Enter = (k: string): boolean => {
  return isKey_F1_F2(k) || k === Enter
}

export const isKey_Enter_Escape = (k: string): boolean => {
  return k === Enter || k === Escape
}

export const isKey_Enter_Delete = (k: string): boolean => {
  return k === Enter || k === Delete
}

export const isKey_Enter_Tab = (k: string): boolean => {
  return k === Enter || k === Tab
}

export const isKey_F1_F2 = (k: string): boolean => {
  return k === F1 || k === F2
}
