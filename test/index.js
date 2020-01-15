const { SchemaModel, T } = require('../lib/index')
const assert = require('assert')

describe('Schema', () => {
  it('should be OK', () => {
    const m = SchemaModel({
      name: T.string('string').required('required').letterOnly('letterOnly'),
      age: T.number('number').min(18, 'min').max(30, 'max')
    })

    assert.deepEqual(
      m.check({name: 'abc', age: 18}),
      {name: {hasError: false}, age: {hasError: false}},
      'OK'
    )

    assert.deepEqual(
      m.check({name: null, age: 18}),
      {name: {hasError: true, errorMessage: 'required'}, age: {hasError: false}},
      'name - required'
    )

    assert.deepEqual(
      m.check({name: 0, age: 18}),
      {name: {hasError: true, errorMessage: 'string'}, age: {hasError: false}},
      'name - string'
    )

    assert.deepEqual(
      m.check({name: 'abc', age: 'abc'}),
      {name: {hasError: false}, age: {hasError: true, errorMessage: 'number'}},
      'age - number'
    )

    assert.deepEqual(
      m.check({name: 'abc', age: 40}),
      {name: {hasError: false}, age: {hasError: true, errorMessage: 'max'}},
      'age - max'
    )
  })

  it('should clone type OK', () => {
    const t1 = T.string().minlen(2)
    const t2 = t1.clone().maxlen(4).required()
    const m = SchemaModel({
      name1: t1,
      name2: t2
    })
    const r = m.check({
      name1: 'abcdefg',
      name2: 'abcdefg'
    })
    assert.equal(r.name1.hasError, false, 't1 OK')
    assert.equal(r.name2.hasError, true, 't1 error')
  })
})