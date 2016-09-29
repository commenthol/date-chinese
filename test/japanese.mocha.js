/* globals describe, it */
/* eslint no-multi-spaces: 0 */

'use strict'

const assert = require('assert')
const julian = require('astronomia').julian

const CalendarJapanese = require('..').CalendarJapanese

process.env.TZ = 'Asia/Tokyo'

describe('#CalendarJapanese', function () {
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
