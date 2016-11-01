/**
 * @copyright 2016 commenthol
 * @license MIT
 */

const julian = require('astronomia/lib/julian')
const CalendarChinese = require('./Chinese')

// Start of Korean Calendar in 2333 BCE (단군기원 http://ko.wikipedia.org/wiki/단기)
const epochY = -2333
const epoch = new julian.CalendarGregorian(epochY, 1, 27).toJDE()

// change of timezone shifts during the last century
const UTC_DATES = [
  { date: new julian.CalendarGregorian(1961, 10, 10).toDate(),
    shift: 9 / 24 }, // +9:00:00h (135° East) Korean meridian
  { date: new julian.CalendarGregorian(1954, 3, 21).toDate(),
    shift: 8.5 / 24 },
  { date: new julian.CalendarGregorian(1912, 1, 1).toDate(),
    shift: 9 / 24 },
  { date: new julian.CalendarGregorian(1908, 4, 1).toDate(),
    shift: 8.5 / 24 }
]

class CalendarKorean extends CalendarChinese {
  constructor (cycle, year, month, leap, day) {
    super(cycle, year, month, leap, day)

    this._epochY = epochY
    this._epoch = epoch
  }

  /**
   * timeshift to UTC
   *
   * @param {CalendarGregorian} gcal - gregorian calendar date
   * @return {Number} timeshift in fraction of day
   */
  timeshiftUTC (gcal) {
    let date = gcal.toDate()
    for (var i in UTC_DATES) {
      if (date >= UTC_DATES[i].date) {
        return UTC_DATES[i].shift
      }
    }
    return 3809 / 450 / 24 // Seoul City Hall 126°58'
  }
}
module.exports = CalendarKorean
