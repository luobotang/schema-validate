const Type = require('./Type')

class DateType extends Type {
  constructor(errorMessage = 'Please enter a valid date') {
    super('date')
    this.rule(value => !/Invalid|NaN/.test(new Date(value)), errorMessage)
  }

  range(min, max, errorMessage) {
    return this.rule(
      value => new Date(value) >= new Date(min) && new Date(value) <= new Date(max),
      errorMessage
    )
  }

  min(min, errorMessage) {
    return this.rule(value => new Date(value) >= new Date(min), errorMessage)
  }

  max(max, errorMessage) {
    return this.rule(value => new Date(value) <= new Date(max), errorMessage)
  }

  strict(errorMessage) {
    return this.rule(value => Object.prototype.toString.call(value) === '[object Date]', errorMessage)
  }
}

module.exports = errorMessage => new DateType(errorMessage)
