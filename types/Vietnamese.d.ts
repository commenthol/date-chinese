/**
 * @copyright 2016 commenthol
 * @license MIT
 */
import CalendarChinese from './Chinese.js';
export default class CalendarVietnamese extends CalendarChinese {
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
