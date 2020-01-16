const Type = require('./Type')

class ArrayType extends Type {

  constructor(desc) {
    super('array', desc)
    this.rule(v => Array.isArray(v), '应为数组')
  }

  range(min, max, errorMessage) {
    return this.rule(
      value => value.length >= min && value.length <= max,
      errorMessage || `长度应在 ${min} 到 ${max} 之间`
    )
  }

  minlen(min, errorMessage) {
    return this.rule(value => value.length >= min, errorMessage || `长度不小于 ${min}`)
  }

  maxlen(max, errorMessage) {
    return this.rule(value => value.length <= max, errorMessage || `长度不大于 ${max}`)
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
    }, errorMessage || '不能重复')
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
    }, errorMessage || '不能重复')
  }

  /**
   * @example
   * ArrayType('这是一个数组').of(
   *   StringType().isOneOf(['数码','体育','游戏','旅途','其他']
   * )
   */
  of(type) {
    return this.rule((items, data) => {
      for (let item of items) {
        const result = type.check(item, data)
        if (result.hasError) return result
      }
      return true
    })
  }
}

module.exports = errorMessage => new ArrayType(errorMessage)
