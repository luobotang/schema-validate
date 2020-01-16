const Type = require('./Type')

class BooleanType extends Type {
  constructor(desc) {
    super('boolean', desc)
    this.rule(v => typeof v === 'boolean', '应为布尔值')
  }
}

module.exports = errorMessage => new BooleanType(errorMessage)
