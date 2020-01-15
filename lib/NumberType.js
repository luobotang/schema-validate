const Type = require('./Type')

class NumberType extends Type {
  constructor(errorMessage = 'Please enter a valid number') {
    super('number')
    this.rule(value => typeof value === 'number', errorMessage)
  }

  integer(errorMessage) {
    return this.rule(value => value.toString().indexOf('.') === -1, errorMessage)
  }

  range(min, max, errorMessage) {
    return this.rule(value => value >= min && value <= max, errorMessage)
  }

  min(min, errorMessage) {
    return this.rule(value => value >= min, errorMessage)
  }

  max(max, errorMessage) {
    return this.rule(value => value <= max, errorMessage)
  }

  oneOf(list, errorMessage) {
    return this.rule(value => list.indexOf(value) !== -1, errorMessage)
  }
}

module.exports = errorMessage => new NumberType(errorMessage)
