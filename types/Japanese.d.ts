/**
 * @copyright 2016 commenthol
 * @license MIT
 */
import CalendarChinese from './Chinese.js';
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
export default class CalendarJapanese extends CalendarChinese {
    /**
     * timeshift to UTC
     *
     * @param {{ toYear(): number, toDate(): Date }} gcal - Gregorian calendar date
     * @returns {number} timeshift in fraction of day
     */
    timeshiftUTC(gcal: {
        toYear(): number;
        toDate(): Date;
    }): number;
}
