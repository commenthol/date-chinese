/**
 * @copyright 2016 commenthol
 * @license MIT
 */

import { base, solstice, solar, moonphase, planetposition, julian } from 'astronomia'
import { vsop87Bearth } from './vsop87Bearth.js'

const earth = new planetposition.Planet(vsop87Bearth)
const lunarOffset = moonphase.meanLunarMonth / 2
const p = 180 / Math.PI

// Start of Chinese Calendar in 2636 BCE by Chalmers
const epochY = -2636
const epoch = new julian.CalendarGregorian(epochY, 2, 15).toJDE()

function toYear (jde) {
  return new julian.CalendarGregorian().fromJDE(jde).toYear()
}

// prevent rounding errors
function toFixed (val, e) {
  return parseFloat(val.toFixed(e), 10)
}

export default class CalendarChinese {
  /**
   * constructor
   *
   * @param {Number|Array|Object} cycle - chinese 60 year cicle; if `{Array}` than `[cycle, year, ..., day]`
   * @param {Number} year - chinese year of cycle
   * @param {Number} month - chinese month
   * @param {Number} leap - `true` if leap month
   * @param {Number} day - chinese day
   */
  constructor (cycle, year, month, leap, day) {
    this.set(cycle, year, month, leap, day)

    this._epochY = epochY
    this._epoch = epoch
    this._cache = { // cache for results
      lon: {},
      sue: {},
      ny: {}
    }
  }

  /**
   * set a new chinese date
   *
   * @param {Number|Array|Object} cycle - chinese 60 year cicle; if `{Array}` than `[cycle, year, ..., day]`
   * @param {Number} year - chinese year of cycle
   * @param {Number} month - chinese month
   * @param {Number} leap - `true` if leap month
   * @param {Number} day - chinese day
   */
  set (cycle, year, month, leap, day) {
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
   * @returns {Array}
   */
  get () {
    return [this.cycle, this.year, this.month, this.leap, this.day]
  }

  /**
   * get Gregorian year from Epoch / Cycle
   * @return {Number} year
   */
  yearFromEpochCycle () {
    return this._epochY + (this.cycle - 1) * 60 + (this.year - 1)
  }

  /**
   * convert gregorian date to chinese calendar date
   *
   * @param {Number} year - (int) year in Gregorian or Julian Calendar
   * @param {Number} month - (int)
   * @param {Number} day - needs to be in correct (chinese) timezone
   * @return {Object} this
   */
  fromGregorian (year, month, day) {
    const j = this.midnight(new julian.CalendarGregorian(year, month, day).toJDE())
    if (month === 1 && day <= 20) year-- // chinese new year never starts before 20/01
    this._from(j, year)
    return this
  }

  /**
   * convert date to chinese calendar date
   *
   * @param {Date} date - javascript date object
   * @return {Object} this
   */
  fromDate (date) {
    const j = this.midnight(new julian.CalendarGregorian().fromDate(date).toJDE())
    this._from(j, date.getFullYear())
    return this
  }

  /**
   * convert JDE to chinese calendar date
   *
   * @param {Number} jde - date in JDE
   * @return {Object} this
   */
  fromJDE (jde) {
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
   * @param {Number} j - date in JDE
   * @param {Number} year - gregorian year
   */
  _from (j, year) {
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

    this.month = this.inMajorSolarTerm(nm).term
    const m = Math.round((nm - ny) / moonphase.meanLunarMonth)
    if (m === 0) {
      this.month = 1
      this.leap = false
    } else {
      this.leap = this.isLeapMonth(nm)
    }

    if (m > this.month) {
      this.month = m
    } else if (this.leap) {
      this.month--
    }

    this.day = 1 + Math.trunc(toFixed(j, 3) - toFixed(nm, 3))
  }

  /**
   * convert chinese date to gregorian date
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Object} date in gregorian (preleptic) calendar; Timezone is Standard Chinese / Bejing Time
   *   {Number} year - (int)
   *   {Number} month - (int)
   *   {Number} day - (int)
   */
  toGregorian (gyear) {
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
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Date} javascript date object in gregorian (preleptic) calendar
   */
  toDate (gyear) {
    const jde = this.toJDE(gyear)
    return new julian.CalendarGregorian().fromJDE(toFixed(jde, 4)).toDate()
  }

  /**
   * convert chinese date to JDE
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Number} date in JDE
   */
  toJDE (gyear) {
    const years = gyear || this.yearFromEpochCycle()
    const ny = this.newYear(years)
    let nm = ny
    if (this.month > 1) {
      nm = this.previousNewMoon(ny + this.month * 29)
      const st = this.inMajorSolarTerm(nm).term
      const lm = this.isLeapMonth(nm)

      if (st > this.month) {
        nm = this.previousNewMoon(nm - 1)
      } else if (st < this.month || (lm && !this.leap)) {
        nm = this.nextNewMoon(nm + 1)
      }
    }
    if (this.leap) {
      nm = this.nextNewMoon(nm + 1)
    }
    const jde = nm + this.day - 1
    return jde
  }

  /**
   * timeshift to UTC
   *
   * @param {CalendarGregorian} gcal - gregorian calendar date
   * @return {Number} timeshift in fraction of day
   */
  timeshiftUTC (gcal) {
    if (gcal.toYear() >= 1929) {
      return 8 / 24 // +8:00:00h Standard China time zone (120° East)
    }
    return 1397 / 180 / 24 // +7:45:40h Beijing (116°25´ East)
  }

  /**
   * time/date at midnight - truncate `jde` to actual day
   *
   * @param {Number} jde - julian ephemeris day
   * @return {Number} truncated jde
   */
  midnight (jde) {
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
   * @returns {Number} major solar term part of that month
   */
  inMajorSolarTerm (jde) {
    const lon = this._cache.lon[jde] || solar.apparentVSOP87(earth, jde).lon
    this._cache.lon[jde] = lon
    const lonDeg = lon * p - 1e-13
    const term = (2 + Math.floor(lonDeg / 30)) % 12 + 1
    return { term, lon: lonDeg }
  }

  /**
   * Test if date `jde` is inside a leap month
   * `jde` and previous new moon need to have the same major solar term
   *
   * @param {Number} jde - date of new moon
   * @returns {Boolean} `true` if previous new moon falls into same solar term
   */
  isLeapMonth (jde) {
    const t1 = this.inMajorSolarTerm(jde)
    const next = this.nextNewMoon(this.midnight(jde + lunarOffset))
    const t2 = this.inMajorSolarTerm(next)
    const r = (t1.term === t2.term)
    return r
  }

  /**
   * next new moon since `jde`
   *
   * @param {Number} jde - date in julian ephemeris days
   * @return {Number} jde at midnight
   */
  nextNewMoon (jde) {
    let nm = this.midnight(moonphase.newMoon(toYear(jde)))
    let cnt = 0
    while (nm < jde && cnt++ < 4) {
      nm = this.midnight(moonphase.newMoon(toYear(jde + cnt * lunarOffset)))
    }
    return nm
  }

  /**
   * next new moon since `jde`
   *
   * @param {Number} jde - date in julian ephemeris days
   * @return {Number} jde at midnight
   */
  previousNewMoon (jde) {
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
   * @param {Number} gyear - gregorian year (int)
   * @param {Number} jde at midnight
   */
  newYear (gyear) {
    gyear = Math.trunc(gyear)
    if (this._cache.ny[gyear]) return this._cache.ny[gyear]

    const sue1 = this._cache.sue[gyear - 1] || solstice.december2(gyear - 1, earth)
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
   * @param {Number} term - jiéqì solar term 1 .. 24
   * @param {Number} [gyear] - (int) gregorian year
   * @returns {Number} jde at midnight
   */
  solarTerm (term, gyear) {
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
   * @param {Number} term - zhōngqì solar term Z1 .. Z12
   * @param {Number} [gyear] - (int) gregorian year
   * @returns {Number} jde at midnight
   */
  majorSolarTerm (term, gyear) {
    return this.solarTerm(term * 2, gyear)
  }

  /**
   * get minor solar term
   *
   * @param {Number} term - jiéqì solar term J1 .. J12
   * @param {Number} [gyear] - (int) gregorian year
   * @returns {Number} jde at midnight
   */
  minorSolarTerm (term, gyear) {
    return this.solarTerm(term * 2 - 1, gyear)
  }

  /**
   * Qı̄ngmíng - Pure brightness Festival
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @returns {Number} jde at midnight
   */
  qingming (gyear) {
    return this.solarTerm(5, gyear)
  }
}
