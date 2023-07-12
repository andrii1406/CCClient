
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

