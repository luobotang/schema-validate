const ArrayType = require('../lib/ArrayType')
const { T } = require('../lib/index')
const assert = require('assert')

describe('ArrayType', () => {
  it('check()', () => {
    const t = ArrayType().range(2, 4)
    assert.equal(t.check([1,2]).hasError, false, 'range - OK')
    assert.equal(t.check([1,2,3,4,5]).hasError, true, 'range - X')
  })

  it('unique() & uniqueKey()', () => {
    const t = ArrayType().unique()
    assert.equal(t.check([1,2,3,4]).hasError, false, 'unique - OK')
    assert.equal(t.check([1,2,2,1]).hasError, true, 'unique - X')

    const t2 = ArrayType().uniqueKey('id')
    assert.equal(t2.check([{id:1},{id:2},{id:3}]).hasError, false, 'uniqueKey - OK')
    assert.equal(t2.check([{id:1},{id:2},{id:2}]).hasError, true, 'uniqueKey - X')
  })

  it('of()', () => {
    const t = ArrayType().of(
      T.object().shape({
        name: T.string('string').required('required'),
        age: T.number().min(18, 'min')
      })
    )

    assert.deepEqual(
      t.check([{name: 'abc', age: 18}]),
      {hasError: false},
      'OK'
    )
    assert.deepEqual(
      t.check([{name: 0, age: 18}]),
      {hasError: true, errorMessage: 'string'},
      'X - string'
    )
    assert.deepEqual(
      t.check([{name: 'abc', age: 10}]),
      {hasError: true, errorMessage: 'min'},
      'X - min'
    )
  })
})