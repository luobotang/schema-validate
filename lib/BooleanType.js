import Type from './Type'

class BooleanType extends Type {
  constructor(errorMessage = 'Please enter a valid `boolean`') {
    super('boolean')
    this.rule(v => typeof v === 'boolean', errorMessage)
  }
}

export default errorMessage => new BooleanType(errorMessage)
