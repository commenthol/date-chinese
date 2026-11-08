/**
 * @copyright 2016 commenthol
 * @license MIT
 */
export default class CalendarChinese {
    _epochY: number;
    _epoch: number;
    _cache: {
        lon: {};
        sue: {};
        ny: {};
    };
    cycle: any;
    year: any;
    month: any;
    leap: any;
    day: any;
    leapSui: boolean;
    /**
     * constructor
     *
     * @param {number|Array<number|boolean>|CalendarChinese} [cycle] - Chinese 60 year cycle; arrays contain `[cycle, year, month, leap, day]`
     * @param {number} [year] - Chinese year of cycle
     * @param {number} [month] - Chinese month
     * @param {boolean|number} [leap] - `true` if leap month
     * @param {number} [day] - Chinese day
     */
    constructor(cycle?: number | Array<number | boolean> | CalendarChinese, year?: number, month?: number, leap?: boolean | number, day?: number);
    /**
     * set a new Chinese date
     *
     * @param {number|Array<number|boolean>|CalendarChinese} [cycle] - Chinese 60 year cycle; arrays contain `[cycle, year, month, leap, day]`
     * @param {number} [year] - Chinese year of cycle
     * @param {number} [month] - Chinese month
     * @param {boolean|number} [leap] - `true` if leap month
     * @param {number} [day] - Chinese day
     */
    set(cycle?: number | Array<number | boolean> | CalendarChinese, year?: number, month?: number, leap?: boolean | number, day?: number): this;
    /**
     * returns chinese date
     * @returns {[number, number, number, boolean|number, number]}
     */
    get(): [number, number, number, boolean | number, number];
    /**
     * get Gregorian year from Epoch / Cycle
     * @returns {number} year
     */
    yearFromEpochCycle(): number;
    /**
     * convert gregorian date to chinese calendar date
     *
     * @param {number} year - (int) year in Gregorian or Julian Calendar
     * @param {number} month - (int)
     * @param {number} day - needs to be in correct (Chinese) timezone
     * @returns {this}
     */
    fromGregorian(year: number, month: number, day: number): this;
    /**
     * convert date to chinese calendar date
     *
     * @param {Date} date - javascript date object
     * @returns {this}
     */
    fromDate(date: Date): this;
    /**
     * convert JDE to chinese calendar date
     *
     * @param {number} jde - date in JDE
     * @returns {this}
     */
    fromJDE(jde: number): this;
    /**
     * common conversion from JDE, year to chinese date
     *
     * @private
     * @param {number} j - date in JDE
     * @param {number} year - Gregorian year
     * @returns {void}
     */
    private _from;
    /**
     * convert Chinese date to Gregorian date
     *
     * @param {number} [gyear] - (int) Gregorian year
     * @returns {{ year: number, month: number, day: number }} date in the proleptic Gregorian calendar; timezone is China Standard Time
     */
    toGregorian(gyear?: number): {
        year: number;
        month: number;
        day: number;
    };
    /**
     * convert chinese date to Date
     *
     * @param {number} [gyear] - (int) Gregorian year
     * @returns {Date} JavaScript date object in the proleptic Gregorian calendar
     */
    toDate(gyear?: number): Date;
    /**
     * convert chinese date to JDE
     *
     * @param {number} [gyear] - (int) Gregorian year
     * @returns {number} date in JDE
     */
    toJDE(gyear?: number): number;
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
    /**
     * time/date at midnight - truncate `jde` to actual day
     *
     * @param {number} jde - Julian ephemeris day
     * @returns {number} truncated JDE
     */
    midnight(jde: number): number;
    /**
     * get major solar term `Z1...Z12` for a given date in JDE
     *
     * @param {Number} jde - date of new moon
     * @returns {{ term: number, lon: number }} major solar term and longitude for that month
     */
    inMajorSolarTerm(jde: number): {
        term: number;
        lon: number;
    };
    /**
     * Test if date `jde` is inside a leap month
     * `jde` and previous new moon need to have the same major solar term
     *
     * @param {number} jde - date of new moon
     * @returns {boolean} `true` if previous new moon falls into same solar term
     */
    isLeapMonth(jde: number): boolean;
    /**
     * next new moon since `jde`
     *
     * @param {number} jde - date in Julian ephemeris days
     * @returns {number} JDE at midnight
     */
    nextNewMoon(jde: number): number;
    /**
     * previous new moon since `jde`
     *
     * @param {number} jde - date in Julian ephemeris days
     * @returns {number} JDE at midnight
     */
    previousNewMoon(jde: number): number;
    /**
     * chinese new year for a given gregorian year
     *
     * @param {number} gyear - Gregorian year (int)
     * @returns {number} JDE at midnight
     */
    newYear(gyear: number): number;
    /**
     * get solar term from solar longitude
     *
     * @param {number} term - jiéqì solar term 1 .. 24
     * @param {number} [gyear] - (int) Gregorian year
     * @returns {number} JDE at midnight
     */
    solarTerm(term: number, gyear?: number): number;
    /**
     * get major solar term
     *
     * @param {number} term - zhōngqì solar term Z1 .. Z12
     * @param {number} [gyear] - (int) Gregorian year
     * @returns {number} JDE at midnight
     */
    majorSolarTerm(term: number, gyear?: number): number;
    /**
     * get minor solar term
     *
     * @param {number} term - jiéqì solar term J1 .. J12
     * @param {number} [gyear] - (int) Gregorian year
     * @returns {number} JDE at midnight
     */
    minorSolarTerm(term: number, gyear?: number): number;
    /**
     * Qı̄ngmíng - Pure brightness Festival
     *
     * @param {number} [gyear] - (int) Gregorian year
     * @returns {number} JDE at midnight
     */
    qingming(gyear?: number): number;
}
