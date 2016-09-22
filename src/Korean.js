/**
 * @copyright 2016 commenthol
 * @license MIT
 */

const CalendarChinese = require('./Chinese')

class CalendarKorean extends CalendarChinese {
  /**
   * timeshift to UTC
   *
   * @param {Number} gyear - gregorian year
   * @return {Number} timshift in fraction of day
   */
  timeshiftUTC (gyear) {
    return 9 / 24  // +9:00:00h (135° East) Korean meridian
  }
}
module.exports = CalendarKorean
