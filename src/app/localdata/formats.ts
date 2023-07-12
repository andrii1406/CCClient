
//инернационализация - строковый формат суммы: 10 000,99
export let SumIntl = new Intl.NumberFormat('ru', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

//инернационализация - строковый формат курса: 0,3459
export let KrsIntl = new Intl.NumberFormat('ru', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4
})

//инернационализация - строковый формат дата/время: dd.mm.yyyy, hh:mm:ss
export let DateTimeIntl = new Intl.DateTimeFormat('ru', {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
})
