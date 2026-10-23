// Status lolos gerbang: sessionStorage (dengan try/catch) + cadangan di memori.
const KUNCI = 'hadiah-lolos'
let memori = false

export function sudahLolos() {
  if (memori) return true
  try {
    return sessionStorage.getItem(KUNCI) === '1'
  } catch {
    return false
  }
}

export function tandaiLolos() {
  memori = true
  try {
    sessionStorage.setItem(KUNCI, '1')
  } catch {
    /* abaikan */
  }
}
