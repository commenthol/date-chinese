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

/**
 * @see http://law.e-gov.go.jp/htmldata/M19/M19CO051.html
 */
var UTC_DATES = [{ date: new Date('1888-02-11T15:00:00.000Z'), // 1888-02-12T00:00:00+0900
  shift: 9 / 24 // +9:00:00h (135° East) Japanese standard meridian
}];

/**
 * Note: I could not find details about the epoch(s) for the year zero of the
 * Japanese calendar dating before 1873. Therefore this calendar uses (wrongly)
 * the Chinese epoch.
 *
 * According to <https://en.wikipedia.org/wiki/History_of_Japan> the eras are:
 *
 * Yayoi  300 BC – 250 AD
 * Kofun  250 – 538
 * Asuka  538 – 710
 * Nara   710 – 794
 * Heian  794 – 1185
 * Kamakura   1185 – 1333
 * Kenmu Restoration  1333 – 1336
 * Muromachi 1336 – 1573
 * Azuchi–Momoyama 1568 – 1603
 * Edo  1603 – 1868
 * Meiji  1868 – 1912
 * Taishō 1912 – 1926
 * Shōwa  1926 – 1989
 * Heisei 1989 – present
 *
 * Unfortunately the linking from era to calendar era (especially to the Chinese
 * pre 1873 one) is unknown to me.
 */

var CalendarJapanese = function (_CalendarChinese) {
  _inherits(CalendarJapanese, _CalendarChinese);

  function CalendarJapanese() {
    _classCallCheck(this, CalendarJapanese);

    return _possibleConstructorReturn(this, (CalendarJapanese.__proto__ || Object.getPrototypeOf(CalendarJapanese)).apply(this, arguments));
  }

  _createClass(CalendarJapanese, [{
    key: 'timeshiftUTC',

    /**
     * timeshift to UTC
     *
     * @param {CalendarGregorian} gcal - gregorian calendar date
     * @return {Number} timeshift in fraction of day
     */
    value: function timeshiftUTC(gcal) {
      var date = gcal.toDate();
      for (var i in UTC_DATES) {
        if (date >= UTC_DATES[i].date) {
          return UTC_DATES[i].shift;
        }
      }
      return 4193 / 450 / 24; // +9:19:04h (139°46'E)
    }
  }]);

  return CalendarJapanese;
}(CalendarChinese);

module.exports = CalendarJapanese;