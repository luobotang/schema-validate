const DateType = require('../lib/DateType')
const assert = require('assert')

describe('DateType', () => {
  it('range()', () => {
    const t = DateType().range('2019/01/01', '2019/12/31', 'range')
    assert.equal(t.check('2019/10/01').hasError, false, 'OK')
    assert.equal(t.check('2018/10/01').hasError, true, 'X - range min')
    assert.equal(t.check('2020/10/01').hasError, true, 'X - range max')
  })
})