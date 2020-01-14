const Type = require('./Type')

class DateType extends Type {
  constructor(errorMessage = 'Please enter a valid date') {
    super('date')
    this.rule(value => !/Invalid|NaN/.test(new Date(value)), errorMessage)
  }

  range(min, max, errorMessage) {
    this.rule(
      value => new Date(value) >= new Date(min) && new Date(value) <= new Date(max),
      errorMessage
    )
    return this
  }

  min(min, errorMessage) {
    this.rule(value => new Date(value) >= new Date(min), errorMessage)
    return this
  }

  max(max, errorMessage) {
    this.rule(value => new Date(value) <= new Date(max), errorMessage)
    return this
  }
}

export default errorMessage => new DateType(errorMessage)
