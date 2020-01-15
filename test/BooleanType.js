const BooleanType = require('../lib/BooleanType')
const assert = require('assert')

describe('BooleanType', () => {
  it('should be OK', () => {
    const t = BooleanType('error')
    assert.equal(t.check(true).hasError, false, 'true - OK')
    assert.equal(t.check(false).hasError, false, 'false - OK')
    assert.equal(t.check('abc').hasError, true, '"abc" - X')
    assert.equal(t.check({}).hasError, true, '{} - X')
  })
})