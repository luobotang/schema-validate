const { Schema, SchemaModel } = require('./Schema')

exports.Schema = Schema
exports.SchemaModel = SchemaModel

exports.T = {
  string: require('./StringType'),
  number: require('./NumberType'),
  boolean: require('./BooleanType'),
  date: require('./DateType'),
  object: require('./ObjectType'),
  array: require('./ArrayType')
}
