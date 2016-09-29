/**
 * @copyright 2016 commenthol
 * @license MIT
 */

const julian = require('astronomia/lib/julian')
const CalendarChinese = require('./Chinese')

// Start of Korean Calendar in 2333 BCE
const epochY = -2333
const epoch = new julian.CalendarGregorian(epochY, 1, 27).toJDE()

class CalendarKorean extends CalendarChinese {
  constructor (cycle, year, month, leap, day) {
    super(cycle, year, month, leap, day)

    this._epochY = epochY
    this._epoch = epoch
  }

  /**
   * timeshift to UTC
   *
   * @param {Number} gyear - gregorian year
   * @return {Number} timeshift in fraction of day
   */
  timeshiftUTC (gyear) {
    return 9 / 24  // +9:00:00h (135° East) Korean meridian
  }
}
module.exports = CalendarKorean
