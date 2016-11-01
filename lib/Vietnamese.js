'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @copyright 2016 commenthol
 * @license MIT
 */

var CalendarChinese = require('./Chinese');

var CalendarVietnamese = function (_CalendarChinese) {
  _inherits(CalendarVietnamese, _CalendarChinese);

  function CalendarVietnamese() {
    _classCallCheck(this, CalendarVietnamese);

    return _possibleConstructorReturn(this, (CalendarVietnamese.__proto__ || Object.getPrototypeOf(CalendarVietnamese)).apply(this, arguments));
  }

  _createClass(CalendarVietnamese, [{
    key: 'timeshiftUTC',

    /**
     * timeshift to UTC
     *
     * @param {CalendarGregorian} gcal - gregorian calendar date
     * @return {Number} timeshift in fraction of day
     */
    value: function timeshiftUTC(gcal) {
      if (gcal.toYear() >= 1968) {
        return 7 / 24; // +7:00:00h
      }
      return 8 / 24; // +8:00:00h Standard China time zone (120° East)
    }
  }]);

  return CalendarVietnamese;
}(CalendarChinese);

module.exports = CalendarVietnamese;