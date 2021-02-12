// import { julian } from 'astronomia'; // Need to declare type definitions in package

declare module 'date-chinese' {
  export interface GregorianDate {
    year: number;
    month: number;
    day: number;
  }

  export class CalendarChinese {
    constructor(cycle: number, year: number, month: number, leap: number, day: number);
    constructor(cycle?: number[]|CalendarChinese);

    set(cycle: number, year: number, month: number, leap: number, day: number): this;
    set(cycle?: number[]|CalendarChinese): this;

    get(): number[];

    yearFromEpochCycle(): number;

    fromGregorian(year: number, month: number, day: number): this;

    fromDate(date: Date): this;

    fromJDE(jde: number): this;

    toGregorian(gyear: number): GregorianDate;

    toDate(gyear?: number): Date;

    toJDE(gyear?: number): number;

    // timeshiftUTC(gcal: julian.CalendarGregorian): number;
    timeshiftUTC(gcal: object): number;

    midnight(jde: number): number;

    inMajorSolarTerm(jde: number): number;

    isLeapMonth(jde: number): boolean;

    nextNewMoon(jde: number): number;

    previousNewMoon(jde: number): number;

    newYear(gyear: number): number;

    majorSolarTerm(term: number, gyear: number): number;

    minorSolarTerm(term: number, gyear: number): number;

    solarTerm(term: number, gyear: number): number;

    qingming(gyear: number): number;
  }

  export class CalendarJapanese extends CalendarChinese {}

  export class CalendarKorean extends CalendarChinese {}

  export class CalendarVietnamese extends CalendarChinese {}
}
