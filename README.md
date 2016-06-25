# date-chinese

> Chinese Calendar

[![NPM version](https://badge.fury.io/js/date-chinese.svg)](https://www.npmjs.com/package/date-chinese/)
[![Build Status](https://secure.travis-ci.org/commenthol/date-chinese.svg?branch=master)](https://travis-ci.org/commenthol/date-chinese)

Chinese Calendar calculations with conversion from/ to Gregorian Date.

The module supports:

- conversion from Gregorian Date to Chinese Date and vice versa
- conversion from javascript Date object to Chinese Date and vice versa
- conversion from JDE to Chinese Date and vice versa
- calculation of chinese New Year for a given Gregorian year
- calculation of Qı̄ngmíng pure brightness festival
- calculation of solar terms (minor - Jiéqì / major - Zhōngqì)

**Note:** Some calculations may take quite some time (> 40ms). Therefore 
`CalendarChinese` has a built in cache to store results of long running 
calculations.


## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Usage](#usage)
  * [from Gregorian Date](#from-gregorian-date)
  * [to Gregorian Date](#to-gregorian-date)
  * [from Date](#from-date)
  * [to Date](#to-date)
  * [Chinese New Year](#chinese-new-year)
  * [Qı̄ngmíng](#qı̄ngmíng)
  * [Solar Terms](#solar-terms)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Usage

### Construct a new Chinese Date

**Parameters**

**cycle**: `Number | Array | Object`, chinese 60 year cicle; if `{Array}` than `[cycle, year, ..., day]`

**year**: `Number`, chinese year in cycle

**month**: `Number`, chinese month

**leap**: `Number`, `true` if leap month

**day**: `Number`, chinese day


```js
const CalendarChinese = require('date-chinese')
let cal = new CalendarChinese(78, 1, 10, true, 9)
cal.get()
//> [ 78, 1, 10, true, 9 ]
```

or

```js
const CalendarChinese = require('date-chinese')
let cdate = [ 78, 1, 10, true, 9 ]
let cal = new CalendarChinese(cdate)
cal.get()
//> [ 78, 1, 10, true, 9 ]
```

or via setter

```js
const CalendarChinese = require('date-chinese')
let cdate = [ 78, 1, 10, true, 9 ]
let cal = new CalendarChinese()
cal.set(cdate)
cal.get()
//> [ 78, 1, 10, true, 9 ]
```

`CalenderChinese` uses an internal cache for long running calculations.
Use `set()` to reuse cached results.


### from Gregorian Date

The timezone of the gregorian date is Chinese Standard Time (Bejing Time for years less than 1929).

```js
const CalendarChinese = require('date-chinese')
let cal = new CalendarChinese()
cal.fromGregorian(1984, 12,  1)

// properties
cal.cycle  //> 78
cal.year   //> 1
cal.month  //> 10
cal.leap   //> true // is leap month
cal.day    //> 9

let [cycle, year, month, leap, day] = cal.get()
//> [ 78, 1, 10, true, 9 ]
```

### to Gregorian Date

Convert chinese date back to gregorian date

```js
let cal = new CalendarChinese(78, 1, 10, true, 9)
let gdate = cal.toGregorian()
//> { year: 1984, month: 12, day: 1 }
```

### from Date

Calculate chinese calendar date from javascript Date object

```js
let cal = new CalendarChinese()
let date = new Date('1984-12-01T00:00:00+08:00')
cal.fromDate(date)
let cdate = cal.get()
//> [ 78, 1, 10, true, 9 ]
```

### to Date

```js
let cal = new CalendarChinese(78, 1, 10, true, 9)
let date = cal.toDate(date).toISOString()
//> 1984-11-30T16:00:00.426Z
```

### Chinese New Year

```js
const CalendarChinese = require('date-chinese')

let cal = new CalendarChinese()
let newYear = cal.newYear(1985)
cal.fromJDE(newYear)
let cdate = cal.get()
//> [ 78, 2, 1, false, 1 ]

// convert to Gregorian Date (Chinese Standard Time)
let gdate = cal.toGregorian()
//> { year: 1985, month: 2, day: 20 }

// convert to Date
let date = cal.toDate()
//> 1985-02-19T16:00:00.306Z

// convert to Date for more accurate and faster result
const julian = require('astronomia').julian
let date = new julian.CalendarGregorian().fromJDE(newYear).toDate()
//> 1985-02-19T16:00:00.000Z
```

### Qı̄ngmíng

Pure brightness festival date

```js
let cal = new CalendarChinese()
let qm = cal.qingming(1985)
cal.fromJDE(qm)
let cdate = cal.get()
//> [ 78, 2, 2, false, 16 ]
let gdate = cal.toGregorian()
//> { year: 1985, month: 4, day: 5 }
```

or using chinese cycle/ year

```js
let cal = new CalendarChinese(78, 2)
let qm = cal.qingming()
cal.fromJDE(qm)
let cdate = cal.get()
//> [ 78, 2, 2, false, 16 ]
let gdate = cal.toGregorian()
//> { year: 1985, month: 4, day: 5 }
```

### Solar Terms

```js
let cal = new CalendarChinese()
let qm = cal.solarTerm(5, 1985)
cal.fromJDE(qm)
let cdate = cal.get()
//> [ 78, 2, 2, false, 16 ]
let gdate = cal.toGregorian()
//> { year: 1985, month: 4, day: 5 }
```

#### Zhōngqì - Major Solar Terms

```js
let cal = new CalendarChinese()
let qm = cal.majorSolarTerm(3, 1985)
cal.fromJDE(qm)
let cdate = cal.get()
//> [ 78, 2, 3, false, 1 ]
let gdate = cal.toGregorian()
//> { year: 1985, month: 4, day: 20 }
```

#### Jiéqì - Minor Solar Terms

```js
let cal = new CalendarChinese()
let qm = cal.minorSolarTerm(3, 1985)
cal.fromJDE(qm)
let cdate = cal.get()
//> [ 78, 2, 2, false, 16 ]
let gdate = cal.toGregorian()
//> { year: 1985, month: 4, day: 5 }
```

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the MIT license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and licence.

## License

Copyright (c) 2016 commenthol (MIT License)

See [LICENSE][] for more info.

## References

<!-- !ref -->

* [LICENSE][LICENSE]

<!-- ref! -->

[LICENSE]: ./LICENSE
