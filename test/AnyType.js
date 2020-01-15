const AnyType = require('../lib/AnyType')
const { T } = require('../lib/index')
const assert = require('assert')

describe('AnyType', () => {
  it('should be OK', () => {
    const t = AnyType(
      T.string().email(),
      T.date().min('2019/01/01')
    ).required()

    assert.equal(t.check('abc@123.com').hasError, false, 'email')
    assert.equal(t.check('2019/12/31').hasError, false, 'date')
    assert.equal(t.check('abc').hasError, true, 'error')
  })
})