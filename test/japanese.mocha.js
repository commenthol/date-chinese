/* globals describe, it */
/* eslint no-multi-spaces: 0 */

'use strict'

const assert = require('assert')
const julian = require('astronomia').julian

const CalendarJapanese = require('../src').CalendarJapanese

process.env.TZ = 'Asia/Tokyo'

describe('#CalendarJapanese', function () {
  describe('newYear', function () {
    var tests = [
      '1887-01-24T00:00:56+0920',
      '1888-02-12T00:00:00+0900',
      '1986-02-09T00:00:00+0900'
    ]
    var cal = new CalendarJapanese()
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
      { d: [ -2636, 2, 15 ], ch: [ 1, 1, 1, false, 1 ] },
      { d: [ -2635, 2, 15 ], ch: [ 1, 2, 1, false, 13 ] },
      { d: [ 1800, 1, 1 ], ch: [ 74, 56, 12, false, 6 ] },
      { d: [ 1888, 2, 11 ], ch: [ 76, 24, 12, false, 30 ] },
      { d: [ 1888, 2, 12 ], ch: [ 76, 25, 1, false, 1 ] },
      { d: [ 1980, 10, 28 ], ch: [ 77, 57, 9, false, 20 ] },
      { d: [ 1984, 11, 20 ], ch: [ 78, 1, 10, false, 28 ] },
      { d: [ 1984, 12, 1 ], ch: [ 78, 1, 10, true, 9 ] },
      { d: [ 1985, 1, 28 ], ch: [ 78, 1, 12, false, 8 ] },
      { d: [ 1985, 2, 28 ], ch: [ 78, 2, 1, false, 9 ] },
      { d: [ 1985, 3, 22 ], ch: [ 78, 2, 2, false, 2 ] },
      { d: [ 1985, 4, 19 ], ch: [ 78, 2, 2, false, 30 ] },
      { d: [ 1985, 4, 20 ], ch: [ 78, 2, 3, false, 1 ] },
      { d: [ 1985, 7, 19 ], ch: [ 78, 2, 6, false, 2 ] },
      { d: [ 1986, 12, 28 ], ch: [ 78, 3, 11, false, 27 ] },
      { d: [ 2000, 1, 1 ], ch: [ 78, 16, 11, false, 25 ] },
      { d: [ 2015, 7, 15 ], ch: [ 78, 32, 5, false, 30 ] },
      { d: [ 2015, 12, 31 ], ch: [ 78, 32, 11, false, 21 ] },
      { d: [ 2016, 2, 6 ], ch: [ 78, 32, 12, false, 28 ] },
      { d: [ 2016, 2, 7 ], ch: [ 78, 32, 12, false, 29 ] },
      { d: [ 2016, 2, 8 ], ch: [ 78, 33, 1, false, 1 ] },
      { d: [ 2017, 9, 18 ], ch: [ 78, 34, 7, false, 28 ] }
    ]

    describe('fromGregorian', function () {
      let cal = new CalendarJapanese()
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
          let cal = new CalendarJapanese(cycle, year, month, leap, day)
          let res = cal.toGregorian()
          assert.deepEqual([res.year, res.month, res.day], t.d)
        })
      })
    })
  })

  describe('24 Sekki', function (done) {
    // validated against http://eco.mtk.nao.ac.jp/koyomi/yoko/2016/rekiyou162.html.en
    const tests = {
      2015: [
        { sekki: 17, exp: '2015-10-08T00:00:00+0900' }
      ],
      2016: [
        { sekki: 1,  exp: '2016-02-04T00:00:00+0900' },
        { sekki: 2,  exp: '2016-02-19T00:00:00+0900' },
        { sekki: 3,  exp: '2016-03-05T00:00:00+0900' },
        { sekki: 4,  exp: '2016-03-20T00:00:00+0900' },
        { sekki: 5,  exp: '2016-04-04T00:00:00+0900' },
        { sekki: 6,  exp: '2016-04-20T00:00:00+0900' },
        { sekki: 7,  exp: '2016-05-05T00:00:00+0900' },
        { sekki: 8,  exp: '2016-05-20T00:00:00+0900' },
        { sekki: 9,  exp: '2016-06-05T00:00:00+0900' },
        { sekki: 10, exp: '2016-06-21T00:00:00+0900' },
        { sekki: 11, exp: '2016-07-07T00:00:00+0900' },
        { sekki: 12, exp: '2016-07-22T00:00:00+0900' },
        { sekki: 13, exp: '2016-08-07T00:00:00+0900' },
        { sekki: 14, exp: '2016-08-23T00:00:00+0900' },
        { sekki: 15, exp: '2016-09-07T00:00:00+0900' },
        { sekki: 16, exp: '2016-09-22T00:00:00+0900' },
        { sekki: 17, exp: '2016-10-08T00:00:00+0900' },
        { sekki: 18, exp: '2016-10-23T00:00:00+0900' },
        { sekki: 19, exp: '2016-11-07T00:00:00+0900' },
        { sekki: 20, exp: '2016-11-22T00:00:00+0900' },
        { sekki: 21, exp: '2016-12-07T00:00:00+0900' },
        { sekki: 22, exp: '2016-12-21T00:00:00+0900' },
        { sekki: 23, exp: '2017-01-05T00:00:00+0900' },
        { sekki: 24, exp: '2017-01-20T00:00:00+0900' }
      ],
      2017: [
        { sekki: 1,  exp: '2017-02-04T00:00:00+0900' },
        { sekki: 5,  exp: '2017-04-04T00:00:00+0900' },
        { sekki: 12, exp: '2017-07-23T00:00:00+0900' }
      ]
    }
    let cal = new CalendarJapanese()
    Object.keys(tests).forEach((year) => {
      describe('year ' + year, function () {
        tests[year].forEach((test) => {
          it([year, test.sekki].join(' '), function () {
            let jde = cal.solarTerm(test.sekki, year)
            let res = new julian.CalendarGregorian().fromJDE(jde).toDate().toISOString()
            assert.equal(res, new Date(test.exp).toISOString())
          })
        })
      })
    })
  })
})
