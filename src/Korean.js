/**
 * @copyright 2016 commenthol
 * @license MIT
 */

// import {julian} from 'astronomia' // TODO waiting for tree-shaking that works...
import julian from 'astronomia/lib/julian'
import CalendarChinese from './Chinese'

// Start of Korean Calendar in 2333 BCE (단군기원 http://ko.wikipedia.org/wiki/단기)
const epochY = -2333
const epoch = new julian.CalendarGregorian(epochY, 1, 27).toJDE()

/**
 * change of timezone shifts during the last century
 * @see https://en.wikipedia.org/wiki/Time_in_South_Korea
 */
const UTC_DATES = [
  { date: new Date('1961-10-09T15:00:00.000Z'), // 1961-10-10T00:00:00+0900
    shift: 9 / 24 }, // +9:00:00h (135° East)
  { date: new Date('1954-03-20T15:30:00.000Z'), // 1954-03-21T00:00:00+0830
    shift: 8.5 / 24 },
  { date: new Date('1911-12-31T15:00:00.000Z'), // 1912-01-01T00:00:00+0900
    shift: 9 / 24 },
  { date: new Date('1908-03-31T15:30:00.000Z'), // 1908-04-01T00:00:00+0830
    shift: 8.5 / 24 }
]

export default class CalendarKorean extends CalendarChinese {
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
    return 3809 / 450 / 24 // +8:27:52h Seoul City Hall 126°58'E
  }
}
