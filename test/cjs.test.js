import assert from 'assert'
import { createRequire } from 'module'
import * as esm from '../src/index.js'

const require = createRequire(import.meta.url)

describe('CommonJS build', function () {
  const cjs = require('../lib/index.cjs')

  const names = [
    'CalendarChinese',
    'CalendarKorean',
    'CalendarVietnamese',
    'CalendarJapanese'
  ]

  names.forEach((name) => {
    it(`${name} gives the same new year and date as the ESM build`, function () {
      const a = new cjs[name]()
      const b = new esm[name]()
      assert.strictEqual(a.newYear(2026), b.newYear(2026))
      a.fromGregorian(2026, 11, 16)
      b.fromGregorian(2026, 11, 16)
      assert.deepStrictEqual(a.get(), b.get())
    })
  })
})
