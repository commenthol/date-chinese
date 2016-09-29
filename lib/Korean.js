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

// Start of Korean Calendar in 2333 BCE
var epochY = -2333;
var epoch = new julian.CalendarGregorian(epochY, 1, 27).toJDE();

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
   * @param {Number} gyear - gregorian year
   * @return {Number} timeshift in fraction of day
   */


  _createClass(CalendarKorean, [{
    key: 'timeshiftUTC',
    value: function timeshiftUTC(gyear) {
      return 9 / 24; // +9:00:00h (135° East) Korean meridian
    }
  }]);

  return CalendarKorean;
}(CalendarChinese);

module.exports = CalendarKorean;