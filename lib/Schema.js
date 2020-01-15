const StringType = require('./StringType')

class Schema {
  constructor(schema) {
    this.schema = schema;
  }

  getFieldType(fieldName) {
    return this.schema[fieldName] || new StringType()
  }

  getKeys() {
    return Object.keys(this.schema)
  }

  checkForField(fieldName, fieldValue, data) {
    const fieldChecker = this.schema[fieldName]
    if (!fieldChecker) return { hasError: false }
    return fieldChecker.check(fieldValue, data)
  }

  /**
   * 检查整个对象，返回各个属性的检查结果
   * 
   * { name: 'abc', age: 18 } => { name: { hasError: false }, age: { hasError: true, errorMessage: 'xxx' } }
   */
  check(data) {
    const checkResult = {}
    Object.keys(this.schema).forEach(key => {
      checkResult[key] = this.checkForField(key, data[key], data)
    })
    return checkResult
  }

  /**
   * 检查整个对象，返回第一个检查失败的属性及结果
   * 
   * { name: 'abc', age: 18 } => { hasError: true, errorMessage: 'xxx', field: 'age' }
   */
  validate(data) {
    for (let field of Object.keys(this.schema)) {
      const result = this.checkForField(field, data[field], data)
      if (result.hasError) {
        result.field = field
        return result
      }
    }
    return { hasError: false }
  }
}

exports.Schema = Schema

const SchemaModel = o => new Schema(o)

SchemaModel.combine = (...models) => new Schema(
  models
    .map(model => model.schema)
    .reduce((accumulator, currentValue) => Object.assign(accumulator, currentValue), {})
)

exports.SchemaModel = SchemaModel