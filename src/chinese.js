
const base = require('astronomia').base
const solstice = require('astronomia').solstice
const solar = require('astronomia').solar
const moonphase = require('astronomia').moonphase
const planetpos = require('astronomia').planetposition
const julian = require('astronomia').julian

const earth = new planetpos.Planet('earth')
const p = 180 / Math.PI

let debug = 0

// Qı̄ngmíng ~ 5.4.
// Dōngzhì == winter solstice

class CalendarChinese {
  /**
   * @param {Number} cycle
   * @param {Number} year
   * @param {Number} month
   * @param {Number} leap - leap month
   * @param {Number} day
   *
   */
  constructor (cycle, year, month, leap, day) {
    this.cycle = cycle
    this.year = year
    this.month = month
    this.leap = leap
    this.day = day
  }

  /**
   * @param {Number} jde - date of new moon
   * @returns {Number} major solar term part of that month
   */
  majorSolarTerm (jde) {
    let lon = solar.apparentVSOP87(earth, jde).lon
    let lonDeg = lon * p - 1e-13
    let term = (2 + Math.floor(lonDeg / 30)) % 12 + 1
    if (debug) console.log(term, toDate(jde), lonDeg)
    return {term: term, lon: lonDeg}
  }

  /**
   * Test is next new moon is in same solar term
   * @param {Number} jde - date of new moon
   * @param {Boolean} dev - check if deviation in longitude of both terms is less than 2° to catch eceptional years like 1985, 2319
   * @returns {Boolean} `true` if next new moon falls into same solar term
   */
  isSameMajorSolarTerm (jde, dev) {
    let t1 = this.majorSolarTerm(jde)
    let t2 = this.majorSolarTerm(this.nextNewMoon(jde + moonphase.meanLunarMonth / 2))
    let r = (t1.term === t2.term)
    if (dev) {
      function devDeg (t) {
        let r = Math.abs(t.lon % 30) < 2
        // console.log('#3',r, t.lon)
        return r
      }
      // check if longitude of both new moons deviate by less than 2°
      r |= (devDeg(t1) && devDeg(t2))
    }
    return r
  }

  nextNewMoon (jde) {
    let nm = moonphase.new(toYear(jde))
    if (nm < jde) {
      if (debug) console.log(toDate(nm), '<', toDate(jde))
      return moonphase.new(toYear(jde + moonphase.meanLunarMonth / 2))
    }
    return nm
  }

  previousNewMoon (jde) {
    let nm = moonphase.new(toYear(jde))
    if (nm > jde) {
      if (debug) console.log(toDate(nm), '>', toDate(jde))
      return moonphase.new(toYear(jde - moonphase.meanLunarMonth / 2))
    }
    return nm
  }

  /**
   * @param {Number} gYear - gregorian year (int)
   */
  newYear (gYear) {
    let sue1 = solstice.december2(gYear - 1, earth) // [jde]
    let sue2 = solstice.december2(gYear, earth)
    let m11n = this.previousNewMoon(sue2) // [jde]
    let m12 = this.nextNewMoon(sue1) // moonphase.new(toYear(sue1))
    let m13 = moonphase.new(toYear(m12 + moonphase.meanLunarMonth))

    let isLeapYear = Math.round((m11n - m12) / moonphase.meanLunarMonth) === 12

    if (debug) {
      console.log(m11n - m12, Math.round((m11n - m12) / moonphase.meanLunarMonth))
      console.log(toDate(sue1), 'sue1')
      console.log(toDate(m12), 'm12')
      console.log(toDate(m13), 'm13')
      console.log(toDate(m11n), 'm11n')
      console.log(toDate(sue2), 'sue2')
      console.log(isLeapYear, 'isLeapYear')
      // console.log('#1', this.isSameMajorSolarTerm(m12))
      // console.log('#2', this.isSameMajorSolarTerm(m13))
    }
    // console.log(isLeapYear)

    if (isLeapYear && this.isSameMajorSolarTerm(m12) || this.isSameMajorSolarTerm(m13)) {
      return moonphase.new(toYear(m13 + moonphase.meanLunarMonth / 2))
    } else {
      return m13
    }
  }
}
module.exports = CalendarChinese


function toYear (jde) {
  return new julian.Calendar().fromJDE(jde).toYear()
}

function toDate (jde) {
  return new julian.Calendar().fromJDE(jde).toDate()
}


if (module === require.main) {
  debug = 1
  var cal = new CalendarChinese()
  if (1 && debug) {
    let y = 1985
    y = 2319
    // y= 2004
    let nY = cal.newYear(y)
    console.log(toDate(nY))
  } else {
    for (var y = 1980; y <= 2020; y++) {
      let nY = cal.newYear(y)
      console.log(toDate(nY))
    }
  }
}









