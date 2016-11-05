'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @copyright 2016 commenthol
 * @license MIT
 */

var julian = require('astronomia/lib/julian');
var CalendarChinese = require('./Chinese');

// Start of Korean Calendar in 2333 BCE (단군기원 http://ko.wikipedia.org/wiki/단기)
var epochY = -2333;
var epoch = new julian.CalendarGregorian(epochY, 1, 27).toJDE();

/**
 * change of timezone shifts during the last century
 * @see https://en.wikipedia.org/wiki/Time_in_South_Korea
 */
var UTC_DATES = [{ date: new Date('1961-10-09T15:00:00.000Z'), // 1961-10-10T00:00:00+0900
  shift: 9 / 24 }, // +9:00:00h (135° East)
{ date: new Date('1954-03-20T15:30:00.000Z'), // 1954-03-21T00:00:00+0830
  shift: 8.5 / 24 }, { date: new Date('1911-12-31T15:00:00.000Z'), // 1912-01-01T00:00:00+0900
  shift: 9 / 24 }, { date: new Date('1908-03-31T15:30:00.000Z'), // 1908-04-01T00:00:00+0830
  shift: 8.5 / 24 }];

var CalendarKorean = function (_CalendarChinese) {
  _inherits(CalendarKorean, _CalendarChinese);

  function CalendarKorean(cycle, year, month, leap, day) {
    _classCallCheck(this, CalendarKorean);

    var _this = _possibleConstructorReturn(this, (CalendarKorean.__proto__ || Object.getPrototypeOf(CalendarKorean)).call(this, cycle, year, month, leap, day));

    _this._epochY = epochY;
    _this._epoch = epoch;
    return _this;
  }

  /**
   * timeshift to UTC
   *
   * @param {CalendarGregorian} gcal - gregorian calendar date
   * @return {Number} timeshift in fraction of day
   */


  _createClass(CalendarKorean, [{
    key: 'timeshiftUTC',
    value: function timeshiftUTC(gcal) {
      var date = gcal.toDate();
      for (var i in UTC_DATES) {
        if (date >= UTC_DATES[i].date) {
          return UTC_DATES[i].shift;
        }
      }
      return 3809 / 450 / 24; // +8:27:52h Seoul City Hall 126°58'E
    }
  }]);

  return CalendarKorean;
}(CalendarChinese);

module.exports = CalendarKorean;