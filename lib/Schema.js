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
    if (!fieldChecker) {
      // fieldValue can be anything if no schema defined
      return { hasError: false }
    }
    return fieldChecker.check(fieldValue, data)
  }

  check(data) {
    const checkResult = {}
    Object.keys(this.schema).forEach(key => {
      checkResult[key] = this.checkForField(key, data[key], data)
    })
    return checkResult
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