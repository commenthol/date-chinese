/**
 * @copyright 2016 commenthol
 * @license MIT
 */
import CalendarChinese from './Chinese.js';
export default class CalendarKorean extends CalendarChinese {
    /**
     * @param {number|number[]|CalendarChinese} [cycle]
     * @param {number} [year]
     * @param {number} [month]
     * @param {boolean|number} [leap]
     * @param {number} [day]
     */
    constructor(cycle?: number | number[] | CalendarChinese, year?: number, month?: number, leap?: boolean | number, day?: number);
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
