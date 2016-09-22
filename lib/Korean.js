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

var CalendarKorean = function (_CalendarChinese) {
  _inherits(CalendarKorean, _CalendarChinese);

  function CalendarKorean() {
    _classCallCheck(this, CalendarKorean);

    return _possibleConstructorReturn(this, (CalendarKorean.__proto__ || Object.getPrototypeOf(CalendarKorean)).apply(this, arguments));
  }

  _createClass(CalendarKorean, [{
    key: 'timeshiftUTC',

    /**
     * timeshift to UTC
     *
     * @param {Number} gyear - gregorian year
     * @return {Number} timshift in fraction of day
     */
    value: function timeshiftUTC(gyear) {
      return 9 / 24; // +9:00:00h (135° East) Korean meridian
    }
  }]);

  return CalendarKorean;
}(CalendarChinese);

module.exports = CalendarKorean;