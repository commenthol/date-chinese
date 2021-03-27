import { CalendarChinese, CalendarJapanese, CalendarKorean, CalendarVietnamese } from 'date-chinese';

const cc0 = new CalendarChinese(); // $ExpectType CalendarChinese
cc0.fromDate(new Date('1980-12-03T00:00:00+0800')).get(); // $ExpectType number[]

const cc1 = new CalendarChinese(); // $ExpectType CalendarChinese
cc1.newYear(2000); // $ExpectType number
cc1.toDate(); // $ExpectType Date

const cj0 = new CalendarJapanese(); // $ExpectType CalendarJapanese
cj0.newYear(2000); // $ExpectType number
cj0.toDate(); // $ExpectType Date

const ck0 = new CalendarKorean(); // $ExpectType CalendarKorean
ck0.newYear(2000); // $ExpectType number
ck0.toDate(); // $ExpectType Date

const cv0 = new CalendarVietnamese(); // $ExpectType CalendarVietnamese
cv0.newYear(2000); // $ExpectType number
cv0.toDate(); // $ExpectType Date
