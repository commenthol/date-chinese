/**
 * @copyright 2016 commenthol
 * @license MIT
 */

import CalendarChinese from './Chinese.js'

export default class CalendarVietnamese extends CalendarChinese {
  /**
   * timeshift to UTC
   *
   * @param {CalendarGregorian} gcal - gregorian calendar date
   * @return {Number} timeshift in fraction of day
   */
  timeshiftUTC (gcal) {
    if (gcal.toYear() >= 1968) {
      return 7 / 24 // +7:00:00h
    }
    return 8 / 24 // +8:00:00h Standard China time zone (120° East)
  }
}
