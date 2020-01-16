const Type = require('./Type')

class DateType extends Type {
  constructor(desc) {
    super('date', desc)
    this.rule(value => !/Invalid|NaN/.test(new Date(value)), '应为日期')
  }

  range(min, max, errorMessage) {
    return this.rule(
      value => new Date(value) >= new Date(min) && new Date(value) <= new Date(max),
      errorMessage || `应在 ${min.toString()} 到 ${max.toString()} 之间`
    )
  }

  min(min, errorMessage) {
    return this.rule(value => new Date(value) >= new Date(min), errorMessage || `应不小于 ${min.toString()}`)
  }

  max(max, errorMessage) {
    return this.rule(value => new Date(value) <= new Date(max), errorMessage || `应不大于 ${max.toString()}`)
  }

  strict(errorMessage) {
    return this.rule(value => Object.prototype.toString.call(value) === '[object Date]', errorMessage || '应为日期类型')
  }
}

module.exports = errorMessage => new DateType(errorMessage)
