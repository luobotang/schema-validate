const Type = require('./Type')

class NumberType extends Type {
  constructor(desc) {
    super('number', desc)
    this.rule(value => typeof value === 'number', '应为数值')
  }

  integer(errorMessage) {
    return this.rule(value => value.toString().indexOf('.') === -1, errorMessage || '应为整数')
  }

  range(min, max, errorMessage) {
    return this.rule(value => value >= min && value <= max, errorMessage || `应在 ${min} 到 ${max} 之间`)
  }

  min(min, errorMessage) {
    return this.rule(value => value >= min, errorMessage || `应不小于 ${min}`)
  }

  max(max, errorMessage) {
    return this.rule(value => value <= max, errorMessage || `应不大于 ${max}`)
  }

  oneOf(list, errorMessage) {
    return this.rule(value => list.indexOf(value) !== -1, errorMessage || '非指定值')
  }
}

module.exports = errorMessage => new NumberType(errorMessage)
