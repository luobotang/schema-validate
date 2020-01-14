const Type = require('./Type')

class ArrayType extends Type {

  constructor(errorMessage = 'Please enter a valid array') {
    super('array');
    this.rule(v => Array.isArray(v), errorMessage)
  }

  rangeLength(minLength, maxLength, errorMessage) {
    return this.rule(value => value.length >= minLength && value.length <= maxLength, errorMessage)
  }

  minLength(minLength, errorMessage) {
    return this.rule(value => value.length >= minLength, errorMessage)
  }

  maxLength(maxLength, errorMessage) {
    return this.rule(value => value.length <= maxLength, errorMessage)
  }

  unrepeatable(errorMessage) {
    this.rule(items => {
      let hash = {};
      /* eslint-disable */
      for (let i in items) {
        if (hash[items[i]]) {
          return false;
        }
        hash[items[i]] = true;
      }
      return true;
    }, errorMessage);
    return this;
  }

  /**
   * @example
   * ArrayType('这是一个数组').of(
   *      StringType().isOneOf(['数码','体育','游戏','旅途','其他'],
   *      '只能是选择中的值'
   * )
   */
  of(type, errorMessage) {
    return this.rule(items => {
      let valids = items.map(value => type.check(value))
      let errors = valids.filter(item => item.hasError) || []

      if (errors.length) {
        return errors[0]
      }

      return errors.length === 0
    }, errorMessage)
  }
}

module.exports = errorMessage => new ArrayType(errorMessage)
