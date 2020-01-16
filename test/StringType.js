const StringType = require('../lib/StringType')
const assert = require('assert')

describe('StringType', () => {
  it('create', () => {
    const t = StringType()
    assert.equal(typeof t.check, 'function', 't.check()')
    assert.equal(typeof t.rule, 'function', 't.rule()')
    assert.equal(typeof t.required, 'function', 't.required()')
  })

  it('rules with no args', () => {
    function checkRule(ruleName, success, fail) {
      const t = StringType()
      assert.equal(t[ruleName]('error').check(success).hasError, false, `${ruleName}() check '${success}' should not hasError`)
      assert.equal(t[ruleName]('error').check(fail).hasError, true, `${ruleName}() check '${fail}' should hasError`)
    }

    checkRule('hasLetter', 'abc', '123')
    checkRule('hasUppercaseLetter', 'ABC', 'abc')
    checkRule('hasLowercaseLetter', 'abc', 'ABC')
    checkRule('letterOnly', 'aBc', 'a2c')
    checkRule('hasNumber', 'a2c', 'abc')
    checkRule('email', 'abc@123.com', 'abc')
    checkRule('url', 'http://abc.com/123.html', 'abc')
    checkRule('hex', '#fff', 'abcd')
    checkRule('isInteger', '123', '12.3')
    checkRule('isNumber', '12.3', 'abc')
    checkRule('isFloat', '12.3', '123')
    checkRule('isDouble', '12.3', '123')
  })

  it('rules with one args', () => {
    function checkRule(ruleName, arg, success, fail) {
      const t = StringType()
      assert.equal(t[ruleName](arg).check(success).hasError, false, `${ruleName}() check '${success}' should not hasError`)
      assert.equal(t[ruleName](arg).check(fail).hasError, true, `${ruleName}() check '${fail}' should hasError`)
    }

    checkRule('oneOf', ['a', 'b', 'c'], 'a', 'd')
    checkRule('pattern', /abc/, 'abc', 'def')
    checkRule('minlen', 2, 'abc', 'a')
    checkRule('maxlen', 2, 'a', 'abc')
    checkRule('length', 2, 'ab', 'a')
  })

  it('.same()', () => {
    const t = StringType().same('password', 'same')
    assert.equal(t.check('123', {password: '123'}).hasError, false, 'OK')
    assert.equal(t.check('123', {password: '456'}).hasError, true, 'error')
  })
})