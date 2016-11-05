/* globals describe, it */
/* eslint no-multi-spaces: 0 */

'use strict'

const assert = require('assert')
const julian = require('astronomia').julian

const CalendarVietnamese = require('../src').CalendarVietnamese

// process.env.TZ = 'Asia/Ho_Chi_Minh'

describe('#CalendarVietnamese', function () {
  describe('newYear', function () {
    var tests = [
      '1967-02-09T00:00:00+0800',
      '1968-01-29T00:00:00+0700',
      '1985-01-21T00:00:00+0700', // this date is different to Chinese
      '1986-02-09T00:00:00+0700'
    ]
    var cal = new CalendarVietnamese()
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
      {d: [1980, 10, 28], ch: [77, 57,  9, false, 20]},
      {d: [1984, 11, 20], ch: [78,  1, 10, false, 28]},
      {d: [1984, 12,  1], ch: [78,  1, 11, false,  9]},
      {d: [1985,  1, 28], ch: [78,  2,  1, false,  8]},
      {d: [1985,  2, 28], ch: [78,  2,  2, false,  9]},
      {d: [1985,  3, 22], ch: [78,  2,  2, true,   2]},
      {d: [1985,  4, 19], ch: [78,  2,  2, true,  30]},
      {d: [1985,  4, 20], ch: [78,  2,  3, false,  1]},
      {d: [1986, 12, 28], ch: [78,  3, 11, false, 28]},
      {d: [1985,  7, 19], ch: [78,  2,  6, false,  2]},
      {d: [2000,  1,  1], ch: [78, 16, 11, false, 25]},
      {d: [2015,  7, 15], ch: [78, 32,  5, false, 30]},
      {d: [2015, 12, 31], ch: [78, 32, 11, false, 21]},
      {d: [2016,  2,  6], ch: [78, 32, 12, false, 28]},
      {d: [2016,  2,  7], ch: [78, 32, 12, false, 29]},
      {d: [2016,  2,  8], ch: [78, 33,  1, false,  1]},
      {d: [2017,  9, 18], ch: [78, 34,  7, false, 28]}
    ]

    describe('fromGregorian', function () {
      let cal = new CalendarVietnamese()
      tests.forEach(function (t) {
        let [y, m, d] = t.d
        it(t.d.join('-'), function () {
          cal.fromGregorian(y, m, d)
          assert.deepEqual([cal.cycle, cal.year, cal.month, cal.leap, cal.day], t.ch)
        })
      })
    })

    describe('toGregorian', function () {
      tests.forEach(function (t) {
        let [cycle, year, month, leap, day] = t.ch
        it(t.d.join('-') + ' ' + [cycle, year, month, leap, day].join('-'), function () {
          let cal = new CalendarVietnamese(cycle, year, month, leap, day)
          let res = cal.toGregorian()
          assert.deepEqual([res.year, res.month, res.day], t.d)
        })
      })
    })
  })
})
