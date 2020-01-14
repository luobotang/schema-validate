const Type = require('./Type')

class ObjectType extends Type {
  constructor(errorMessage = 'Please enter a valid `object`') {
    super('object');
    this.rule(v => typeof v === 'object', errorMessage)
  }

  /**
   * @example
   * ObjectType('这是一个对象').shape({
   *  name: StringType(),
   *  age: NumberType()
   * })
   */
  shape(types) {
    return this.rule(values => {
      let valids = Object.entries(types).map(item => {
        let key = item[0]
        let type = item[1]
        return type.check(values[key])
      })

      let errors = valids.filter(item => item.hasError) || []

      if (errors.length) {
        return errors[0];
      }

      return errors.length === 0
    }, null)
  }
}

module.exports = errorMessage => new ObjectType(errorMessage);
