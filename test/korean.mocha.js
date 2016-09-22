/* globals describe, it */
/* eslint no-multi-spaces: 0 */

'use strict'

const assert = require('assert')
const julian = require('astronomia').julian

const CalendarKorean = require('..').CalendarKorean

// process.env.TZ = 'Asia/Ho_Chi_Minh'

describe('#CalendarKorean', function () {
  describe('newYear', function () {
    var tests = [
      '1985-02-20T00:00:00+0900',
      '1986-02-09T00:00:00+0900'
    ]
    var cal = new CalendarKorean()
    tests.forEach(function (t) {
      var date = new Date(t)
      it(t, function () {
        var y = date.getFullYear()
        var jde = cal.newYear(y)
        var res = new julian.CalendarGregorian().fromJDE(jde).toDate()
        var td = new Date(t)
        var err = Math.abs(+res - +td)
        // test max error 2sec
        assert.ok(err < 1000, res.toISOString() + ' !== ' + t)
      })
    })
  })

  describe('Gregorian', function () {
    var tests = [
      {d: [-2333, 1, 27], ch: [1,   1,  1, false,  1]},
      {d: [-2332, 2, 27], ch: [1,   2,  1, false, 13]},
      {d: [1980, 10, 28], ch: [72, 54,  9, false, 20]},
      {d: [1984, 11, 20], ch: [72, 58, 10, false, 28]},
      {d: [1984, 12,  1], ch: [72, 58, 10, true,   9]},
      {d: [1985,  1, 28], ch: [72, 58, 12, false,  8]},
      {d: [1985,  2, 28], ch: [72, 59,  1, false,  9]},
      {d: [1985,  3, 22], ch: [72, 59,  2, false,  2]},
      {d: [1985,  4, 19], ch: [72, 59,  2, false, 30]},
      {d: [1985,  4, 20], ch: [72, 59,  3, false,  1]},
      {d: [1985,  7, 19], ch: [72, 59,  6, false,  2]},
      {d: [1986, 12, 28], ch: [72, 60, 11, false, 27]},
      {d: [2000,  1,  1], ch: [73, 13, 11, false, 25]},
      {d: [2015,  7, 15], ch: [73, 29,  5, false, 30]},
      {d: [2015, 12, 31], ch: [73, 29, 11, false, 21]},
      {d: [2016,  2,  6], ch: [73, 29, 12, false, 28]},
      {d: [2016,  2,  7], ch: [73, 29, 12, false, 29]},
      {d: [2016,  2,  8], ch: [73, 30,  1, false,  1]},
      {d: [2017,  9, 18], ch: [73, 31,  7, false, 28]}
    ]

    describe('fromGregorian', function () {
      let cal = new CalendarKorean()
      tests.forEach(function (t) {
        let [y, m, d] = t.d
        it(t.d, function () {
          cal.fromGregorian(y, m, d)
          assert.deepEqual([cal.cycle, cal.year, cal.month, cal.leap, cal.day], t.ch)
        })
      })
    })

    describe('toGregorian', function () {
      tests.forEach(function (t) {
        let [cycle, year, month, leap, day] = t.ch
        it(t.d.join('-') + ' ' + [cycle, year, month, leap, day].join('-'), function () {
          let cal = new CalendarKorean(cycle, year, month, leap, day)
          let res = cal.toGregorian()
          assert.deepEqual([res.year, res.month, res.day], t.d)
        })
      })
    })
  })
})
