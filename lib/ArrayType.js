const Type = require('./Type')

class ArrayType extends Type {

  constructor(errorMessage = 'Please enter a valid array') {
    super('array');
    this.rule(v => Array.isArray(v), errorMessage)
  }

  range(min, max, errorMessage) {
    return this.rule(value => value.length >= min && value.length <= max, errorMessage)
  }

  minlen(min, errorMessage) {
    return this.rule(value => value.length >= min, errorMessage)
  }

  maxlen(maxLength, errorMessage) {
    return this.rule(value => value.length <= maxLength, errorMessage)
  }

  unique(errorMessage) {
    return this.rule(items => {
      let hash = {}
      for (let i of items) {
        if (hash[i]) {
          return false
        }
        hash[i] = true
      }
      return true
    }, errorMessage)
  }

  uniqueKey(key, errorMessage) {
    return this.rule(items => {
      let hash = {}
      for (let item of items) {
        const v = item[key]
        if (hash[v]) {
          return false
        }
        hash[v] = true
      }
      return true
    }, errorMessage)
  }

  /**
   * @example
   * ArrayType('这是一个数组').of(
   *      StringType().isOneOf(['数码','体育','游戏','旅途','其他'],
   *      '只能是选择中的值'
   * )
   */
  of(type, errorMessage) {
    return this.rule((items, data) => {
      for (let item of items) {
        const result = type.check(item, data)
        if (result.hasError) return result
      }
      return true
    }, errorMessage)
  }
}

module.exports = errorMessage => new ArrayType(errorMessage)
