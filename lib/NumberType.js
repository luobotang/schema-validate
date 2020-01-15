const Type = require('./Type')

function FN(value) {
  return +value
}

/**
 * TODO 貌似 NumberType 校验的数据可以是 String 类型，这个会不会有点奇怪？
 */
class NumberType extends Type {
  constructor(errorMessage = 'Please enter a valid number') {
    super('number');
    this.rule(value => /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value), errorMessage)
  }

  integer(errorMessage) {
    return this.rule(value => /^-?\d+$/.test(value), errorMessage)
  }

  pattern(regexp, errorMessage) {
    return this.rule(value => regexp.test(value), errorMessage)
  }

  oneOf(list, errorMessage) {
    return this.rule(value => list.includes(FN(value)), errorMessage)
  }

  range(min, max, errorMessage) {
    return this.rule(value => FN(value) >= min && FN(value) <= max, errorMessage)
  }

  min(min, errorMessage) {
    return this.rule(value => FN(value) >= min, errorMessage)
  }

  max(max, errorMessage) {
    return this.rule(value => FN(value) <= max, errorMessage)
  }
}

module.exports = errorMessage => new NumberType(errorMessage)
