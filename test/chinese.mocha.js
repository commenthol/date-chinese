/* globals describe, it */
/* eslint no-multi-spaces: 0 */

'use strict'

process.env.TZ = 'Asia/Shanghai'

const assert = require('assert')
const julian = require('astronomia').julian

const CalendarChinese = require('..').CalendarChinese

function toDate (jde) {
  return new julian.Calendar().fromJDE(jde).toDate()
}

describe('#CalendarChinese', function () {
  describe('construction', function () {
    let cal
    let exp = [78, 1, 10, true, 9]
    it('can construct via new', function () {
      cal = new CalendarChinese(78, 1, 10, true, 9)
      assert.ok(cal instanceof CalendarChinese)
      assert.deepEqual(cal.get(), exp)
    })

    it('can construct with class instance', function () {
      let cal1 = new CalendarChinese(cal)
      assert.ok(cal1 instanceof CalendarChinese)
      assert.ok(cal1 !== cal)
      assert.deepEqual(cal.get(), exp)
    })

    it('can construct with array', function () {
      let cal1 = new CalendarChinese(exp)
      assert.ok(cal1 !== cal)
      assert.deepEqual(cal.get(), exp)
    })
  })

  describe('midnight', function () {
    const tests = [
      {d: '1984-12-19T23:59:00+0800', exp: '1984-12-19T00:00:00+0800'},
      {d: '1984-12-20T00:00:00+0800', exp: '1984-12-20T00:00:00+0800'},
      {d: '1984-12-20T00:01:00+0800', exp: '1984-12-20T00:00:00+0800'},
      {d: '1928-01-01T00:14:20+0800', exp: '1928-01-01T00:14:20+0800'},
      {d: '1928-01-01T00:00:00+0800', exp: '1927-12-31T00:14:20+0800'}
    ]
    const cal = new CalendarChinese()
    tests.forEach(function (t) {
      it(t.d, function () {
        let c = new julian.Calendar().fromDate(new Date(t.d))
        let mn = cal.midnight(c.toJDE())
        assert.equal(toDate(mn).toISOString(), new Date(t.exp).toISOString())
      })
    })

    it('can call midnight twice', function () {
      let c = new julian.Calendar().fromDate(new Date(tests[1].d))
      let mn = cal.midnight(c.toJDE())
      mn = cal.midnight(mn)
      assert.equal(toDate(mn).toISOString(), new Date(tests[1].exp).toISOString())
    })
  })

  describe('newYear', function () {
    var tests = require('./fixtures/newYear')
    // tests = ['1833-02-20T00:00:20+0746']
    var cal = new CalendarChinese()
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

  describe('qingming', function () {
    var tests = [
      ['1740', {year: 1740, month: 4, day: 4}, '1740-04-04T00:00:00.000Z'],
      ['1900', {year: 1900, month: 4, day: 5}, '1900-04-05T00:00:00.000Z'],
      ['1981', {year: 1981, month: 4, day: 5}, '1981-04-05T00:00:00.000Z'],
      ['2001', {year: 2001, month: 4, day: 5}, '2001-04-05T00:00:00.000Z'],
      ['2010', {year: 2010, month: 4, day: 5}, '2010-04-05T00:00:00.000Z'],
      ['2016', {year: 2016, month: 4, day: 4}, '2016-04-04T00:00:00.000Z']
    ]

    tests.forEach(function (test) {
      let y = test[0]
      it(y, function () {
        let cal = new CalendarChinese()
        let qm = cal.qingming(y)
        cal.fromJDE(qm)
        let gre = cal.toGregorian()
        assert.deepEqual(gre, test[1])
        // converting to Gregorian using jde
        let date = new julian.CalendarGregorian().fromJDE(qm).toDate()
        let ts = cal.timeshiftUTC(date.getFullYear())
        date = new Date(+date + ts * 86400000)
        assert.equal(date.toISOString(), test[2])
      })
    })
  })

  var tests = [
    [ [ 1, 2016 ],  [ 2016, 2, 4 ],   [ 78, 32, 12, false, 26 ] ],
    [ [ 2, 2016 ],  [ 2016, 2, 19 ],  [ 78, 33, 1,  false, 12 ] ],
    [ [ 3, 2016 ],  [ 2016, 3, 5 ],   [ 78, 33, 1,  false, 27 ] ],
    [ [ 4, 2016 ],  [ 2016, 3, 20 ],  [ 78, 33, 2,  false, 12 ] ],
    [ [ 5, 2016 ],  [ 2016, 4, 4 ],   [ 78, 33, 2,  false, 27 ] ],
    [ [ 6, 2016 ],  [ 2016, 4, 19 ],  [ 78, 33, 3,  false, 13 ] ],
    [ [ 7, 2016 ],  [ 2016, 5, 5 ],   [ 78, 33, 3,  false, 29 ] ],
    [ [ 8, 2016 ],  [ 2016, 5, 20 ],  [ 78, 33, 4,  false, 14 ] ],
    [ [ 9, 2016 ],  [ 2016, 6, 5 ],   [ 78, 33, 5,  false,  1 ] ],
    [ [ 10, 2016 ], [ 2016, 6, 21 ],  [ 78, 33, 5,  false, 17 ] ],
    [ [ 11, 2016 ], [ 2016, 7, 7 ],   [ 78, 33, 6,  false,  4 ] ],
    [ [ 12, 2016 ], [ 2016, 7, 22 ],  [ 78, 33, 6,  false, 19 ] ],
    [ [ 13, 2016 ], [ 2016, 8, 7 ],   [ 78, 33, 7,  false,  5 ] ],
    [ [ 14, 2016 ], [ 2016, 8, 23 ],  [ 78, 33, 7,  false, 21 ] ],
    [ [ 15, 2016 ], [ 2016, 9, 7 ],   [ 78, 33, 8,  false,  7 ] ],
    [ [ 16, 2016 ], [ 2016, 9, 22 ],  [ 78, 33, 8,  false, 22 ] ],
    [ [ 17, 2016 ], [ 2016, 10, 8 ],  [ 78, 33, 9,  false,  8 ] ],
    [ [ 18, 2016 ], [ 2016, 10, 23 ], [ 78, 33, 9,  false, 23 ] ],
    [ [ 19, 2016 ], [ 2016, 11, 7 ],  [ 78, 33, 10, false,  8 ] ],
    [ [ 20, 2016 ], [ 2016, 11, 22 ], [ 78, 33, 10, false, 23 ] ],
    [ [ 21, 2016 ], [ 2016, 12, 7 ],  [ 78, 33, 11, false,  9 ] ],
    [ [ 22, 2016 ], [ 2016, 12, 21 ], [ 78, 33, 11, false, 23 ] ],
    [ [ 23, 2016 ], [ 2017, 1, 5 ],   [ 78, 33, 12, false,  8 ] ],
    [ [ 24, 2016 ], [ 2017, 1, 20 ],  [ 78, 33, 12, false, 23 ] ]
  ]

  describe('solarTerm', function () {
    let cal = new CalendarChinese()
    tests.forEach(function (test) {
      let t = test[0][0]
      let y = test[0][1]
      it(y + ' ' + t, function () {
        let st = cal.solarTerm(t, y)
        // converting to Gregorian
        let gre = cal.fromJDE(st).toGregorian()
        assert.deepEqual(cal.get(), test[2])
        assert.deepEqual([gre.year, gre.month, gre.day], test[1])
      })
    })
  })

  describe('majorSolarTerm', function () {
    let cal = new CalendarChinese()
    tests.forEach(function (test, idx) {
      if (idx % 2 === 0) return

      let t = Math.floor(test[0][0] / 2)
      let y = test[0][1]

      it(y + ' ' + t, function () {
        let st = cal.majorSolarTerm(t, y)
        // converting to Gregorian
        let gre = cal.fromJDE(st).toGregorian()
        assert.deepEqual([gre.year, gre.month, gre.day], test[1])
      })
    })
  })

  describe('minorSolarTerm', function () {
    let cal = new CalendarChinese()
    tests.forEach(function (test, idx) {
      if (idx % 2 === 1) return

      let t = Math.floor(test[0][0] / 2) + 1
      let y = test[0][1]

      it(y + ' ' + t, function () {
        let st = cal.minorSolarTerm(t, y)
        // converting to Gregorian
        let gre = cal.fromJDE(st).toGregorian()
        assert.deepEqual([gre.year, gre.month, gre.day], test[1])
      })
    })
  })

  describe('Gregorian', function () {
    var tests = [
      {d: [-2636, 2, 15], ch: [1,   1,  1, false,  1]},
      {d: [-2635, 2, 15], ch: [1,   2,  1, false, 13]},
      {d: [0, 1, 1],      ch: [44, 56, 12, false,  9]},
      {d: [1, 1, 1],      ch: [44, 57, 11, false, 21]},
      {d: [2, 1, 1],      ch: [44, 58, 12, false,  2]},
      {d: [1582, 10, 15], ch: [71, 19,  9, false, 19]},
      {d: [1582, 10, 16], ch: [71, 19,  9, false, 20]},
      {d: [1582, 10, 17], ch: [71, 19,  9, false, 21]},
      {d: [1600, 1, 1],   ch: [71, 36, 11, false, 16]},
      {d: [1980, 10, 28], ch: [77, 57,  9, false, 20]},
      {d: [1984, 11, 20], ch: [78,  1, 10, false, 28]},
      {d: [1984, 12,  1], ch: [78,  1, 10, true,   9]},
      {d: [1985,  1, 28], ch: [78,  1, 12, false,  8]},
      {d: [1985,  2, 28], ch: [78,  2,  1, false,  9]},
      {d: [1986, 12, 28], ch: [78,  3, 11, false, 27]},
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
      let cal = new CalendarChinese()
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
          let cal = new CalendarChinese(cycle, year, month, leap, day)
          let res = cal.toGregorian()
          assert.deepEqual([res.year, res.month, res.day], t.d)
        })
      })
    })
  })
})
