/**
 * @copyright 2016 commenthol
 * @license MIT
 */

import {
  base,
  solstice,
  solar,
  moonphase,
  planetposition,
  julian
} from 'astronomia'
import { vsop87Bearth } from './vsop87Bearth.js'

const earth = new planetposition.Planet(vsop87Bearth)
const lunarOffset = moonphase.meanLunarMonth / 2
const p = 180 / Math.PI

// Start of Chinese Calendar in 2636 BCE by Chalmers
const epochY = -2636
const epoch = new julian.CalendarGregorian(epochY, 2, 15).toJDE()

function toYear(jde) {
  return new julian.CalendarGregorian().fromJDE(jde).toYear()
}

// prevent rounding errors
function toFixed(val, e) {
  return parseFloat(val.toFixed(e))
}

export default class CalendarChinese {
  /**
   * constructor
   *
   * @param {number|Array<number|boolean>|CalendarChinese} [cycle] - Chinese 60 year cycle; arrays contain `[cycle, year, month, leap, day]`
   * @param {number} [year] - Chinese year of cycle
   * @param {number} [month] - Chinese month
   * @param {boolean|number} [leap] - `true` if leap month
   * @param {number} [day] - Chinese day
   */
  constructor(cycle, year, month, leap, day) {
    this.set(cycle, year, month, leap, day)

    this._epochY = epochY
    this._epoch = epoch
    this._cache = {
      // cache for results
      lon: {},
      sue: {},
      ny: {},
      m11: {},
      leap: {}
    }
  }

  /**
   * set a new Chinese date
   *
   * @param {number|Array<number|boolean>|CalendarChinese} [cycle] - Chinese 60 year cycle; arrays contain `[cycle, year, month, leap, day]`
   * @param {number} [year] - Chinese year of cycle
   * @param {number} [month] - Chinese month
   * @param {boolean|number} [leap] - `true` if leap month
   * @param {number} [day] - Chinese day
   */
  set(cycle, year, month, leap, day) {
    if (cycle instanceof CalendarChinese) {
      this.cycle = cycle.cycle
      this.year = cycle.year
      this.month = cycle.month
      this.leap = cycle.leap
      this.day = cycle.day
    } else if (Array.isArray(cycle)) {
      this.cycle = cycle[0]
      this.year = cycle[1]
      this.month = cycle[2]
      this.leap = cycle[3]
      this.day = cycle[4]
    } else {
      this.cycle = cycle
      this.year = year
      this.month = month
      this.leap = leap
      this.day = day
    }
    return this
  }

  /**
   * returns chinese date
   * @returns {[number, number, number, boolean|number, number]}
   */
  get() {
    return [this.cycle, this.year, this.month, this.leap, this.day]
  }

  /**
   * get Gregorian year from Epoch / Cycle
   * @returns {number} year
   */
  yearFromEpochCycle() {
    return this._epochY + (this.cycle - 1) * 60 + (this.year - 1)
  }

  /**
   * convert gregorian date to chinese calendar date
   *
   * @param {number} year - (int) year in Gregorian or Julian Calendar
   * @param {number} month - (int)
   * @param {number} day - needs to be in correct (Chinese) timezone
   * @returns {this}
   */
  fromGregorian(year, month, day) {
    const j = this.midnight(
      new julian.CalendarGregorian(year, month, day).toJDE()
    )
    if (month === 1 && day <= 20) year-- // chinese new year never starts before 20/01
    this._from(j, year)
    return this
  }

  /**
   * convert date to chinese calendar date
   *
   * @param {Date} date - javascript date object
   * @returns {this}
   */
  fromDate(date) {
    const j = this.midnight(
      new julian.CalendarGregorian().fromDate(date).toJDE()
    )
    this._from(j, date.getFullYear())
    return this
  }

  /**
   * convert JDE to chinese calendar date
   *
   * @param {number} jde - date in JDE
   * @returns {this}
   */
  fromJDE(jde) {
    const j = this.midnight(jde)
    const gc = new julian.CalendarGregorian().fromJDE(j)
    if (gc.month === 1 && gc.day < 20) gc.year-- // chinese new year never starts before 20/01
    this._from(j, gc.year)
    return this
  }

  /**
   * common conversion from JDE, year to chinese date
   *
   * @private
   * @param {number} j - date in JDE
   * @param {number} year - Gregorian year
   * @returns {void}
   */
  _from(j, year) {
    let ny = this.newYear(year)
    if (ny > j) {
      ny = this.newYear(year - 1)
    }
    let nm = this.previousNewMoon(j)
    if (nm < ny) {
      nm = ny
    }

    const years = 1.5 + (ny - this._epoch) / base.BesselianYear
    this.cycle = 1 + Math.trunc((years - 1) / 60)
    this.year = 1 + Math.trunc((years - 1) % 60)

    // count the months from month 11 which holds the december solstice
    const { gyear, m11 } = this._sui(nm)
    const leapIndex = this._leapIndex(gyear)
    let m = Math.round((nm - m11) / moonphase.meanLunarMonth)
    this.leap = leapIndex > 0 && m === leapIndex
    if (leapIndex > 0 && m >= leapIndex) m--
    this.month = ((m + 10) % 12) + 1

    this.day = 1 + Math.trunc(toFixed(j, 3) - toFixed(nm, 3))
  }

  /**
   * convert Chinese date to Gregorian date
   *
   * @param {number} [gyear] - (int) Gregorian year
   * @returns {{ year: number, month: number, day: number }} date in the proleptic Gregorian calendar; timezone is China Standard Time
   */
  toGregorian(gyear) {
    const jde = this.toJDE(gyear)
    const gc = new julian.CalendarGregorian().fromJDE(jde + 0.5) // add 0.5 as day get truncated
    return {
      year: gc.year,
      month: gc.month,
      day: Math.trunc(gc.day)
    }
  }

  /**
   * convert chinese date to Date
   *
   * @param {number} [gyear] - (int) Gregorian year
   * @returns {Date} JavaScript date object in the proleptic Gregorian calendar
   */
  toDate(gyear) {
    const jde = this.toJDE(gyear)
    return new julian.CalendarGregorian().fromJDE(toFixed(jde, 4)).toDate()
  }

  /**
   * convert chinese date to JDE
   *
   * @param {number} [gyear] - (int) Gregorian year
   * @returns {number} date in JDE
   */
  toJDE(gyear) {
    const years = Math.trunc(gyear || this.yearFromEpochCycle())
    // months 11 and 12 belong to the sui which starts in `years`
    const suiYear = this.month >= 11 ? years : years - 1
    const leapIndex = this._leapIndex(suiYear)
    let m = (this.month + 1) % 12 // months since month 11
    if (this.leap || (leapIndex > 0 && m >= leapIndex)) m++
    let nm = this._month11(suiYear)
    for (let i = 0; i < m; i++) {
      nm = this.nextNewMoon(this.midnight(nm + lunarOffset))
    }
    const jde = nm + this.day - 1
    return jde
  }

  /**
   * timeshift to UTC
   *
   * @param {{ toYear(): number, toDate(): Date }} gcal - Gregorian calendar date
   * @returns {number} timeshift in fraction of day
   */
  timeshiftUTC(gcal) {
    if (gcal.toYear() >= 1929) {
      return 8 / 24 // +8:00:00h Standard China time zone (120° East)
    }
    return 1397 / 180 / 24 // +7:45:40h Beijing (116°25´ East)
  }

  /**
   * time/date at midnight - truncate `jde` to actual day
   *
   * @param {number} jde - Julian ephemeris day
   * @returns {number} truncated JDE
   */
  midnight(jde) {
    const gcal = new julian.CalendarGregorian().fromJDE(jde)
    const ts = 0.5 - this.timeshiftUTC(gcal)
    let mn = Math.trunc(gcal.toJD() - ts) + ts
    mn = gcal.fromJD(mn).toJDE()
    if (toFixed(jde, 5) === toFixed(mn, 5) + 1) {
      return jde
    }
    return mn
  }

  /**
   * get major solar term `Z1...Z12` for a given date in JDE
   *
   * @param {Number} jde - date of new moon
   * @returns {{ term: number, lon: number }} major solar term and longitude for that month
   */
  inMajorSolarTerm(jde) {
    const lonRad = this._cache.lon[jde] || solar.apparentVSOP87(earth, jde).lon
    this._cache.lon[jde] = lonRad
    const lon = lonRad * p - 1e-13
    const term = ((2 + Math.floor(lon / 30)) % 12) + 1
    return { term, lon }
  }

  /**
   * Test if date `jde` is inside a leap month
   * The leap month is the first month without a major solar term in a sui
   * with 13 months.
   *
   * @param {number} jde - date of new moon
   * @returns {boolean} `true` if month is the leap month of its sui
   */
  isLeapMonth(jde) {
    const { gyear, m11 } = this._sui(jde)
    const leapIndex = this._leapIndex(gyear)
    return (
      leapIndex > 0 &&
      Math.round((jde - m11) / moonphase.meanLunarMonth) === leapIndex
    )
  }

  /**
   * Test if month starting at `jde` holds no major solar term
   *
   * @private
   * @param {number} jde - date of new moon
   * @returns {boolean}
   */
  _hasNoMajorTerm(jde) {
    const t1 = this.inMajorSolarTerm(jde)
    const next = this.nextNewMoon(this.midnight(jde + lunarOffset))
    const t2 = this.inMajorSolarTerm(next)
    return t1.term === t2.term
  }

  /**
   * start of month 11, the month which holds the december solstice
   *
   * @private
   * @param {number} gyear - Gregorian year (int)
   * @returns {number} JDE at midnight
   */
  _month11(gyear) {
    if (this._cache.m11[gyear]) return this._cache.m11[gyear]
    const sue = this._cache.sue[gyear] || solstice.december2(gyear, earth)
    this._cache.sue[gyear] = sue
    const day = this.midnight(sue)
    // previousNewMoon may return an earlier new moon; step to the last one
    let m11 = this.previousNewMoon(day)
    let next = this.nextNewMoon(this.midnight(m11 + lunarOffset))
    while (next <= day) {
      m11 = next
      next = this.nextNewMoon(this.midnight(m11 + lunarOffset))
    }
    this._cache.m11[gyear] = m11
    return m11
  }

  /**
   * find the sui (span from one month 11 to the next) which holds `jde`
   *
   * @private
   * @param {number} jde - date in JDE
   * @returns {{ gyear: number, m11: number }} Gregorian year and start of month 11 of that sui
   */
  _sui(jde) {
    let gyear = new julian.CalendarGregorian().fromJDE(jde).year
    let m11 = this._month11(gyear)
    if (m11 > jde) {
      gyear--
      m11 = this._month11(gyear)
    }
    return { gyear, m11 }
  }

  /**
   * Only a sui with 13 months has a leap month. It is the first month
   * without a major solar term.
   *
   * @private
   * @param {number} gyear - Gregorian year (int) where the sui starts
   * @returns {number} index of leap month counted from month 11; 0 if none
   */
  _leapIndex(gyear) {
    if (gyear in this._cache.leap) return this._cache.leap[gyear]
    const m11 = this._month11(gyear)
    const next = this._month11(gyear + 1)
    let leapIndex = 0
    if (Math.round((next - m11) / moonphase.meanLunarMonth) === 13) {
      let nm = m11
      for (let i = 1; i < 13; i++) {
        nm = this.nextNewMoon(this.midnight(nm + lunarOffset))
        if (this._hasNoMajorTerm(nm)) {
          leapIndex = i
          break
        }
      }
    }
    this._cache.leap[gyear] = leapIndex
    return leapIndex
  }

  /**
   * next new moon since `jde`
   *
   * @param {number} jde - date in Julian ephemeris days
   * @returns {number} JDE at midnight
   */
  nextNewMoon(jde) {
    let nm = this.midnight(moonphase.newMoon(toYear(jde)))
    let cnt = 0
    while (nm < jde && cnt++ < 4) {
      nm = this.midnight(moonphase.newMoon(toYear(jde + cnt * lunarOffset)))
    }
    return nm
  }

  /**
   * previous new moon since `jde`
   *
   * @param {number} jde - date in Julian ephemeris days
   * @returns {number} JDE at midnight
   */
  previousNewMoon(jde) {
    let nm = this.midnight(moonphase.newMoon(toYear(jde)))
    let cnt = 0
    while (nm > jde && cnt++ < 4) {
      nm = this.midnight(moonphase.newMoon(toYear(jde - cnt * lunarOffset)))
    }
    return nm
  }

  /**
   * chinese new year for a given gregorian year
   *
   * @param {number} gyear - Gregorian year (int)
   * @returns {number} JDE at midnight
   */
  newYear(gyear) {
    gyear = Math.trunc(gyear)
    if (this._cache.ny[gyear]) return this._cache.ny[gyear]

    const sue1 =
      this._cache.sue[gyear - 1] || solstice.december2(gyear - 1, earth)
    const sue2 = this._cache.sue[gyear] || solstice.december2(gyear, earth)
    this._cache.sue[gyear - 1] = sue1
    this._cache.sue[gyear] = sue2

    const m11n = this.previousNewMoon(this.midnight(sue2 + 1))
    const m12 = this.nextNewMoon(this.midnight(sue1 + 1))
    const m13 = this.nextNewMoon(this.midnight(m12 + lunarOffset))
    this.leapSui = Math.round((m11n - m12) / moonphase.meanLunarMonth) === 12
    let ny = m13

    if (this.leapSui && (this.isLeapMonth(m12) || this.isLeapMonth(m13))) {
      ny = this.nextNewMoon(this.midnight(m13 + moonphase.meanLunarMonth / 2))
    }
    this._cache.ny[gyear] = ny
    return ny
  }

  /**
   * get solar term from solar longitude
   *
   * @param {number} term - jiéqì solar term 1 .. 24
   * @param {number} [gyear] - (int) Gregorian year
   * @returns {number} JDE at midnight
   */
  solarTerm(term, gyear) {
    if (gyear && term <= 3) gyear--
    const years = gyear || this.yearFromEpochCycle()
    const lon = (((term + 20) % 24) * 15) % 360
    let st = solstice.longitude(years, earth, lon / p)
    st = this.midnight(st)
    return st
  }

  /**
   * get major solar term
   *
   * @param {number} term - zhōngqì solar term Z1 .. Z12
   * @param {number} [gyear] - (int) Gregorian year
   * @returns {number} JDE at midnight
   */
  majorSolarTerm(term, gyear) {
    return this.solarTerm(term * 2, gyear)
  }

  /**
   * get minor solar term
   *
   * @param {number} term - jiéqì solar term J1 .. J12
   * @param {number} [gyear] - (int) Gregorian year
   * @returns {number} JDE at midnight
   */
  minorSolarTerm(term, gyear) {
    return this.solarTerm(term * 2 - 1, gyear)
  }

  /**
   * Qı̄ngmíng - Pure brightness Festival
   *
   * @param {number} [gyear] - (int) Gregorian year
   * @returns {number} JDE at midnight
   */
  qingming(gyear) {
    return this.solarTerm(5, gyear)
  }
}
