/**
 * @copyright 2016 commenthol
 * @license MIT
 */

const CalendarChinese = require('./Chinese')

class CalendarVietnamese extends CalendarChinese {
  /**
   * timeshift to UTC
   *
   * @param {Number} gyear - gregorian year
   * @return {Number} timshift in fraction of day
   */
  timeshiftUTC (gyear) {
    if (gyear < 1968) {
      return 8 / 24   // +8:00:00h Standard China time zone (120° East)
    }
    return 7 / 24     // +7:00:00h
  }
}
module.exports = CalendarVietnamese
