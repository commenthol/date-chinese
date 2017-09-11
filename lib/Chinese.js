'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright 2016 commenthol
 * @license MIT
 */

var base = require('astronomia/lib/base');
var solstice = require('astronomia/lib/solstice');
var solar = require('astronomia/lib/solar');
var moonphase = require('astronomia/lib/moonphase');
var planetpos = require('astronomia/lib/planetposition');
var julian = require('astronomia/lib/julian');

var earth = new planetpos.Planet(require('astronomia/data/vsop87Bearth.js'));
var lunarOffset = moonphase.meanLunarMonth / 2;
var p = 180 / Math.PI;

// Start of Chinese Calendar in 2636 BCE by Chalmers
var epochY = -2636;
var epoch = new julian.CalendarGregorian(epochY, 2, 15).toJDE();

function toYear(jde) {
  return new julian.CalendarGregorian().fromJDE(jde).toYear();
}

// prevent rounding errors
function toFixed(val, e) {
  return parseFloat(val.toFixed(e), 10);
}

var CalendarChinese = function () {
  /**
   * constructor
   *
   * @param {Number|Array|Object} cycle - chinese 60 year cicle; if `{Array}` than `[cycle, year, ..., day]`
   * @param {Number} year - chinese year of cycle
   * @param {Number} month - chinese month
   * @param {Number} leap - `true` if leap month
   * @param {Number} day - chinese day
   */
  function CalendarChinese(cycle, year, month, leap, day) {
    _classCallCheck(this, CalendarChinese);

    this.set(cycle, year, month, leap, day);

    this._epochY = epochY;
    this._epoch = epoch;
    this._cache = { // cache for results
      lon: {},
      sue: {},
      ny: {}
    };
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


  _createClass(CalendarChinese, [{
    key: 'set',
    value: function set(cycle, year, month, leap, day) {
      if (cycle instanceof CalendarChinese) {
        this.cycle = cycle.cycle;
        this.year = cycle.year;
        this.month = cycle.month;
        this.leap = cycle.leap;
        this.day = cycle.day;
      } else if (Array.isArray(cycle)) {
        this.cycle = cycle[0];
        this.year = cycle[1];
        this.month = cycle[2];
        this.leap = cycle[3];
        this.day = cycle[4];
      } else {
        this.cycle = cycle;
        this.year = year;
        this.month = month;
        this.leap = leap;
        this.day = day;
      }
    }

    /**
     * returns chinese date
     * @returns {Array}
     */

  }, {
    key: 'get',
    value: function get() {
      return [this.cycle, this.year, this.month, this.leap, this.day];
    }

    /**
     * get Gregorian year from Epoch / Cycle
     * @return {Number} year
     */

  }, {
    key: 'yearFromEpochCycle',
    value: function yearFromEpochCycle() {
      return this._epochY + (this.cycle - 1) * 60 + (this.year - 1);
    }

    /**
     * convert gregorian date to chinese calendar date
     *
     * @param {Number} year - (int) year in Gregorian or Julian Calendar
     * @param {Number} month - (int)
     * @param {Number} day - needs to be in correct (chinese) timezone
     * @return {Object} this
     */

  }, {
    key: 'fromGregorian',
    value: function fromGregorian(year, month, day) {
      var j = this.midnight(new julian.CalendarGregorian(year, month, day).toJDE());
      if (month === 1 && day <= 20) year--; // chinese new year never starts before 20/01
      this._from(j, year);
      return this;
    }

    /**
     * convert date to chinese calendar date
     *
     * @param {Date} date - javascript date object
     * @return {Object} this
     */

  }, {
    key: 'fromDate',
    value: function fromDate(date) {
      var j = this.midnight(new julian.CalendarGregorian().fromDate(date).toJDE());
      this._from(j, date.getFullYear());
      return this;
    }

    /**
     * convert JDE to chinese calendar date
     *
     * @param {Number} jde - date in JDE
     * @return {Object} this
     */

  }, {
    key: 'fromJDE',
    value: function fromJDE(jde) {
      var j = this.midnight(jde);
      var gc = new julian.CalendarGregorian().fromJDE(j);
      if (gc.month === 1 && gc.day < 20) gc.year--; // chinese new year never starts before 20/01
      this._from(j, gc.year);
      return this;
    }

    /**
     * common conversion from JDE, year to chinese date
     *
     * @private
     * @param {Number} j - date in JDE
     * @param {Number} year - gregorian year
     */

  }, {
    key: '_from',
    value: function _from(j, year) {
      var ny = this.newYear(year);
      if (ny > j) {
        ny = this.newYear(year - 1);
      }
      var nm = this.previousNewMoon(j);
      if (nm < ny) {
        nm = ny;
      }

      var years = 1.5 + (ny - this._epoch) / base.BesselianYear;
      this.cycle = 1 + Math.trunc((years - 1) / 60);
      this.year = 1 + Math.trunc((years - 1) % 60);

      this.month = this.inMajorSolarTerm(nm).term;
      var m = Math.round((nm - ny) / moonphase.meanLunarMonth);
      if (m === 0) {
        this.month = 1;
        this.leap = false;
      } else {
        this.leap = this.isLeapMonth(nm);
      }

      if (m > this.month) {
        this.month = m;
      } else if (this.leap) {
        this.month--;
      }

      this.day = 1 + Math.trunc(toFixed(j, 3) - toFixed(nm, 3));
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

  }, {
    key: 'toGregorian',
    value: function toGregorian(gyear) {
      var jde = this.toJDE(gyear);
      var gc = new julian.CalendarGregorian().fromJDE(jde + 0.5); // add 0.5 as day get truncated
      return {
        year: gc.year,
        month: gc.month,
        day: Math.trunc(gc.day)
      };
    }

    /**
     * convert chinese date to Date
     *
     * @param {Number} [gyear] - (int) gregorian year
     * @return {Date} javascript date object in gregorian (preleptic) calendar
     */

  }, {
    key: 'toDate',
    value: function toDate(gyear) {
      var jde = this.toJDE(gyear);
      return new julian.CalendarGregorian().fromJDE(toFixed(jde, 4)).toDate();
    }

    /**
     * convert chinese date to JDE
     *
     * @param {Number} [gyear] - (int) gregorian year
     * @return {Number} date in JDE
     */

  }, {
    key: 'toJDE',
    value: function toJDE(gyear) {
      var years = gyear || this.yearFromEpochCycle();
      var ny = this.newYear(years);
      var nm = ny;
      if (this.month > 1) {
        nm = this.previousNewMoon(ny + this.month * 29);
        var st = this.inMajorSolarTerm(nm).term;
        var lm = this.isLeapMonth(nm);

        if (st > this.month) {
          nm = this.previousNewMoon(nm - 1);
        } else if (st < this.month || lm && !this.leap) {
          nm = this.nextNewMoon(nm + 1);
        }
      }
      if (this.leap) {
        nm = this.nextNewMoon(nm + 1);
      }
      var jde = nm + this.day - 1;
      return jde;
    }

    /**
     * timeshift to UTC
     *
     * @param {CalendarGregorian} gcal - gregorian calendar date
     * @return {Number} timeshift in fraction of day
     */

  }, {
    key: 'timeshiftUTC',
    value: function timeshiftUTC(gcal) {
      if (gcal.toYear() >= 1929) {
        return 8 / 24; // +8:00:00h Standard China time zone (120° East)
      }
      return 1397 / 180 / 24; // +7:45:40h Beijing (116°25´ East)
    }

    /**
     * time/date at midnight - truncate `jde` to actual day
     *
     * @param {Number} jde - julian ephemeris day
     * @return {Number} truncated jde
     */

  }, {
    key: 'midnight',
    value: function midnight(jde) {
      var gcal = new julian.CalendarGregorian().fromJDE(jde);
      var ts = 0.5 - this.timeshiftUTC(gcal);
      var mn = Math.trunc(gcal.toJD() - ts) + ts;
      mn = gcal.fromJD(mn).toJDE();
      if (toFixed(jde, 5) === toFixed(mn, 5) + 1) {
        return jde;
      }
      return mn;
    }

    /**
     * get major solar term `Z1...Z12` for a given date in JDE
     *
     * @param {Number} jde - date of new moon
     * @returns {Number} major solar term part of that month
     */

  }, {
    key: 'inMajorSolarTerm',
    value: function inMajorSolarTerm(jde) {
      var lon = this._cache.lon[jde] || solar.apparentVSOP87(earth, jde).lon;
      this._cache.lon[jde] = lon;
      var lonDeg = lon * p - 1e-13;
      var term = (2 + Math.floor(lonDeg / 30)) % 12 + 1;
      return { term: term, lon: lonDeg };
    }

    /**
     * Test if date `jde` is inside a leap month
     * `jde` and previous new moon need to have the same major solar term
     *
     * @param {Number} jde - date of new moon
     * @returns {Boolean} `true` if previous new moon falls into same solar term
     */

  }, {
    key: 'isLeapMonth',
    value: function isLeapMonth(jde) {
      var t1 = this.inMajorSolarTerm(jde);
      var next = this.nextNewMoon(this.midnight(jde + lunarOffset));
      var t2 = this.inMajorSolarTerm(next);
      var r = t1.term === t2.term;
      return r;
    }

    /**
     * next new moon since `jde`
     *
     * @param {Number} jde - date in julian ephemeris days
     * @return {Number} jde at midnight
     */

  }, {
    key: 'nextNewMoon',
    value: function nextNewMoon(jde) {
      var nm = this.midnight(moonphase.new(toYear(jde)));
      var cnt = 0;
      while (nm < jde && cnt++ < 4) {
        nm = this.midnight(moonphase.new(toYear(jde + cnt * lunarOffset)));
      }
      return nm;
    }

    /**
     * next new moon since `jde`
     *
     * @param {Number} jde - date in julian ephemeris days
     * @return {Number} jde at midnight
     */

  }, {
    key: 'previousNewMoon',
    value: function previousNewMoon(jde) {
      var nm = this.midnight(moonphase.new(toYear(jde)));
      var cnt = 0;
      while (nm > jde && cnt++ < 4) {
        nm = this.midnight(moonphase.new(toYear(jde - cnt * lunarOffset)));
      }
      return nm;
    }

    /**
     * chinese new year for a given gregorian year
     *
     * @param {Number} gyear - gregorian year (int)
     * @param {Number} jde at midnight
     */

  }, {
    key: 'newYear',
    value: function newYear(gyear) {
      gyear = Math.trunc(gyear);
      if (this._cache.ny[gyear]) return this._cache.ny[gyear];

      var sue1 = this._cache.sue[gyear - 1] || solstice.december2(gyear - 1, earth);
      var sue2 = this._cache.sue[gyear] || solstice.december2(gyear, earth);
      this._cache.sue[gyear - 1] = sue1;
      this._cache.sue[gyear] = sue2;

      var m11n = this.previousNewMoon(this.midnight(sue2 + 1));
      var m12 = this.nextNewMoon(this.midnight(sue1 + 1));
      var m13 = this.nextNewMoon(this.midnight(m12 + lunarOffset));
      this.leapSui = Math.round((m11n - m12) / moonphase.meanLunarMonth) === 12;
      var ny = m13;

      if (this.leapSui && (this.isLeapMonth(m12) || this.isLeapMonth(m13))) {
        ny = this.nextNewMoon(this.midnight(m13 + moonphase.meanLunarMonth / 2));
      }
      this._cache.ny[gyear] = ny;
      return ny;
    }

    /**
     * get major solar term
     *
     * @param {Number} term - zhōngqì solar term Z1 .. Z12
     * @param {Number} [gyear] - (int) gregorian year
     * @returns {Number} jde at midnight
     */

  }, {
    key: 'majorSolarTerm',
    value: function majorSolarTerm(term, gyear) {
      return this.solarTerm(term * 2, gyear);
    }

    /**
     * get minor solar term
     *
     * @param {Number} term - jiéqì solar term J1 .. J12
     * @param {Number} [gyear] - (int) gregorian year
     * @returns {Number} jde at midnight
     */

  }, {
    key: 'minorSolarTerm',
    value: function minorSolarTerm(term, gyear) {
      return this.solarTerm(term * 2 - 1, gyear);
    }

    /**
     * get solar term from solar longitude
     *
     * @param {Number} term - jiéqì solar term 1 .. 24
     * @param {Number} [gyear] - (int) gregorian year
     * @returns {Number} jde at midnight
     */

  }, {
    key: 'solarTerm',
    value: function solarTerm(term, gyear) {
      if (gyear && term <= 3) gyear--;
      var years = gyear || this.yearFromEpochCycle();
      var lon = (term + 20) % 24 * 15 % 360;
      var st = solstice.longitude(years, earth, lon / p);
      st = this.midnight(st);
      return st;
    }

    /**
     * Qı̄ngmíng - Pure brightness Festival
     *
     * @param {Number} [gyear] - (int) gregorian year
     * @returns {Number} jde at midnight
     */

  }, {
    key: 'qingming',
    value: function qingming(gyear) {
      return this.solarTerm(5, gyear);
    }
  }]);

  return CalendarChinese;
}();

module.exports = CalendarChinese;