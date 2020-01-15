const Type = require('./Type')

class AnyType extends Type {
  /**
   * 检查多个类型，任一个校验通过即可
   */
  constructor(...types) {
    super('any')
    this.rule((value, data) => {
      let result
      for (let type of types) {
        result = type.check(value, data)
        if (!result.hasError) return result
      }
      return result
    }, null)
  }
}

module.exports = (...types) => new AnyType(...types)