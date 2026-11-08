import {
  CalendarChinese,
  GregorianDate,
  CalendarJapanese,
  CalendarKorean,
  CalendarVietnamese
} from 'date-chinese'

const chinese = new CalendarChinese()
const converted: CalendarChinese = chinese.fromDate(
  new Date('1980-12-03T00:00:00+0800')
)
const calendarDate: [number, number, number, boolean | number, number] =
  chinese.get()
const gregorian: GregorianDate = chinese.toGregorian(2000)
const jde: number = chinese.newYear(2000)
const date: Date = chinese.toDate()
const copied = new CalendarChinese(chinese)
const fromArray = new CalendarChinese([78, 1, 10, true, 9])
const setDate: CalendarChinese = chinese.set(78, 1, 10, true, 9)
const fromJDE: CalendarChinese = chinese.fromJDE(jde)
const solarTerm: number = chinese.qingming(2000)

const japanese: CalendarJapanese = new CalendarJapanese().fromDate(new Date())
const korean: CalendarKorean = new CalendarKorean().fromDate(new Date())
const vietnamese: CalendarVietnamese = new CalendarVietnamese().fromDate(
  new Date()
)

void [
  converted,
  calendarDate,
  gregorian,
  date,
  copied,
  fromArray,
  setDate,
  fromJDE,
  solarTerm,
  japanese,
  korean,
  vietnamese
]
