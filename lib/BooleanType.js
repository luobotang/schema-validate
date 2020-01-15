const Type = require('./Type')

class BooleanType extends Type {
  constructor(errorMessage = 'Please enter a valid `boolean`') {
    super('boolean')
    this.rule(v => typeof v === 'boolean', errorMessage)
  }
}

module.exports = errorMessage => new BooleanType(errorMessage)
