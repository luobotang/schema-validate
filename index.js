/*! @luobotang/schema-validate v0.1.6 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value === ''
}

function checkRequired(value, trim) {
  // String trim
  if (trim && typeof value === 'string') {
    value = value.replace(/(^\s*)|(\s*$)/g, '');
  }

  // Array
  if (Array.isArray(value)) {
    return !!value.length
  }

  return !isEmpty(value)
}

function createValidator(data, desc) {
  return function (value, rules) {
    for (var i = 0; i < rules.length; i += 1) {
      var ref = rules[i];
      var onValid = ref.onValid;
      var errorMessage = ref.errorMessage;
      var checkResult = onValid(value, data);

      if (checkResult === false) {
        return { hasError: true, errorMessage: desc + errorMessage } // "数据描述" + "规则错误描述"
      } else if (typeof checkResult === 'object' && checkResult.hasError) {
        return checkResult
      }
    }

    return null
  }
}

var Type = function Type(name, desc) {
  this.name = name;
  this._desc = desc || ''; // 数据描述，用于拼接规则 errorMessage 得到最终错误描述
  this._required = false;
  this._requiredMessage = '';
  this._trim = false;
  this._rules = [];
  this._priorityRules = []; // 优先规则
};

Type.prototype.check = function check (value, data) {
  if (this._required && !checkRequired(value, this.trim)) {
    return { hasError: true, errorMessage: this._desc + this._requiredMessage }
  }

  var validator = createValidator(data, this._desc);
  var checkStatus = validator(value, this._priorityRules);

  if (checkStatus) {
    return checkStatus
  }

  if (!this._required && isEmpty(value)) {
    return { hasError: false }
  }

  return validator(value, this._rules) || { hasError: false }
};

Type.prototype.rule = function rule (onValid, errorMessage, priority) {
  if (priority) {
    this._priorityRules.push({ onValid: onValid, errorMessage: errorMessage });
  } else {
    this._rules.push({ onValid: onValid, errorMessage: errorMessage });
  }
  return this
};

Type.prototype.required = function required (errorMessage, trim) {
    if ( errorMessage === void 0 ) errorMessage = '不能为空';
    if ( trim === void 0 ) trim = true;

  this._required = true;
  this._trim = trim;
  this._requiredMessage = errorMessage;
  return this
};

Type.prototype.desc = function desc (desc$1) {
  this._desc = desc$1 || '';
  return this
};

/**
 * 复制当前对象，得到新的 Type 实例对象，便于复用已有 Type
 */
Type.prototype.clone = function clone () {
  var t = this;
  var n = {};
  Object.setPrototypeOf(n, Object.getPrototypeOf(t)); // 配置继承关系
  n.name = t.name;
  n._desc = t._desc;
  n._required = t._required;
  n._requiredMessage = t._requiredMessage;
  n._trim = t._trim;
  n._rules = t._rules.concat();
  n._priorityRules = t._priorityRules.concat();
  return n
};

var Type_1 = Type;

var REG_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // http://emailregex.com/
var REG_IP = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
var REG_URL = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i'
);

var StringType = /*@__PURE__*/(function (Type) {
  function StringType(desc) {
    Type.call(this, 'string', desc);
    this.rule(function (v) { return typeof v === 'string'; }, '应为字符串');
  }

  if ( Type ) StringType.__proto__ = Type;
  StringType.prototype = Object.create( Type && Type.prototype );
  StringType.prototype.constructor = StringType;

  StringType.prototype.hasLetter = function hasLetter (errorMessage) {
    return this.rule(function (v) { return /[a-zA-Z]/.test(v); }, errorMessage || '应包含字母')
  };

  StringType.prototype.hasUppercaseLetter = function hasUppercaseLetter (errorMessage) {
    return this.rule(function (v) { return /[A-Z]/.test(v); }, errorMessage || '应包含大写字母')
  };

  StringType.prototype.hasLowercaseLetter = function hasLowercaseLetter (errorMessage) {
    return this.rule(function (v) { return /[a-z]/.test(v); }, errorMessage || '应包含小写字母')
  };

  StringType.prototype.letterOnly = function letterOnly (errorMessage) {
    return this.rule(function (v) { return /^[a-zA-Z]+$/.test(v); }, errorMessage || '只能是字母')
  };

  StringType.prototype.hasNumber = function hasNumber (errorMessage) {
    return this.rule(function (v) { return /[0-9]/.test(v); }, errorMessage || '应包含数字')
  };

  StringType.prototype.numberOnly = function numberOnly (errorMessage) {
    return this.rule(function (v) { return /^\d+$/.test(v); }, errorMessage || '只能是数字')
  };

  StringType.prototype.isInteger = function isInteger (errorMessage)  {
    return this.rule(function (v) { return /^-?\d+$/.test(v); }, errorMessage || '应为整数')
  };

  StringType.prototype.isNumber = function isNumber (errorMessage)  {
    return this.rule(function (v) { return /^-?\d+(\.\d+)?$/.test(v); }, errorMessage || '应为数值')
  };

  StringType.prototype.isFloat = function isFloat (errorMessage)  {
    return this.rule(function (v) { return /^-?\d+\.\d+$/.test(v); }, errorMessage || '应为 Float')
  };

  StringType.prototype.isDouble = function isDouble (errorMessage)  {
    return this.isFloat(errorMessage || '应为 Double')
  };

  StringType.prototype.oneOf = function oneOf (list, errorMessage) {
    return this.rule(function (v) { return list.indexOf(v) !== -1; }, errorMessage || '非指定值')
  };

  StringType.prototype.email = function email (errorMessage) {
    return this.rule(function (v) { return REG_EMAIL.test(v); }, errorMessage || '应为 Email')
  };

  StringType.prototype.ip = function ip (errorMessage) {
    return this.rule(function (v) { return REG_IP.test(v); }, errorMessage || '应为 IP 地址')
  };

  StringType.prototype.url = function url (errorMessage) {
    return this.rule(function (v) { return REG_URL.test(v); }, errorMessage || '应为 URL')
  };

  // 颜色值？例如 #fff #ffffff
  StringType.prototype.hex = function hex (errorMessage) {
    return this.rule(function (v) { return /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i.test(v); }, errorMessage || '应为十六进制颜色')
  };

  StringType.prototype.pattern = function pattern (regex, errorMessage) {
    return this.rule(function (value) { return regex.test(value); }, errorMessage || '格式错误')
  };

  StringType.prototype.range = function range (min, max, errorMessage) {
    return this.rule(
      function (value) { return value.length >= min && value.length <= max; },
      errorMessage || ("长度应在 " + min + " 到 " + max + " 字符之间")
    )
  };

  StringType.prototype.minlen = function minlen (min, errorMessage) {
    return this.rule(function (value) { return value.length >= min; }, errorMessage || ("长度不小于 " + min + " 字符"))
  };

  StringType.prototype.maxlen = function maxlen (max, errorMessage) {
    return this.rule(function (value) { return value.length <= max; }, errorMessage || ("长度不大于 " + max + " 字符"))
  };

  StringType.prototype.length = function length (len, errorMessage) {
    return this.rule(function (value) { return value.length === len; }, errorMessage || ("长度应为 " + len + " 字符"))
  };

  StringType.prototype.same = function same (field, errorMessage) {
    return this.rule(
      function (value, data) { return data ? data[field] === value : false; },
      errorMessage || ("值应与字段 " + field + " 一致")
    )
  };

  return StringType;
}(Type_1));

var StringType_1 = function (errorMessage) { return new StringType(errorMessage); };

var Schema = function Schema(schema) {
  this.schema = schema;
};

Schema.prototype.getFieldType = function getFieldType (fieldName) {
  return this.schema[fieldName] || new StringType_1()
};

Schema.prototype.getKeys = function getKeys () {
  return Object.keys(this.schema)
};

Schema.prototype.checkForField = function checkForField (fieldName, fieldValue, data) {
  var fieldChecker = this.schema[fieldName];
  if (!fieldChecker) { return { hasError: false } }
  return fieldChecker.check(fieldValue, data)
};

/**
 * 检查整个对象，返回各个属性的检查结果
 * 
 * { name: 'abc', age: 18 } => { name: { hasError: false }, age: { hasError: true, errorMessage: 'xxx' } }
 */
Schema.prototype.check = function check (data) {
    var this$1 = this;

  var checkResult = {};
  Object.keys(this.schema).forEach(function (key) {
    checkResult[key] = this$1.checkForField(key, data[key], data);
  });
  return checkResult
};

/**
 * 检查整个对象，返回第一个检查失败的属性及结果
 * 
 * { name: 'abc', age: 18 } => { hasError: true, errorMessage: 'xxx', field: 'age' }
 */
Schema.prototype.validate = function validate (data) {
  for (var i = 0, list = Object.keys(this.schema); i < list.length; i += 1) {
    var field = list[i];

      var result = this.checkForField(field, data[field], data);
    if (result.hasError) {
      result.field = field;
      return result
    }
  }
  return { hasError: false }
};

var Schema_2 = Schema;

var SchemaModel = function (o) { return new Schema(o); };

SchemaModel.combine = function () {
  var models = [], len = arguments.length;
  while ( len-- ) models[ len ] = arguments[ len ];

  return new Schema(
  models
    .map(function (model) { return model.schema; })
    .reduce(function (accumulator, currentValue) { return Object.assign(accumulator, currentValue); }, {})
);
};

var SchemaModel_1 = SchemaModel;

var Schema_1 = {
	Schema: Schema_2,
	SchemaModel: SchemaModel_1
};

var NumberType = /*@__PURE__*/(function (Type) {
  function NumberType(desc) {
    Type.call(this, 'number', desc);
    this.rule(function (value) { return typeof value === 'number'; }, '应为数值');
  }

  if ( Type ) NumberType.__proto__ = Type;
  NumberType.prototype = Object.create( Type && Type.prototype );
  NumberType.prototype.constructor = NumberType;

  NumberType.prototype.integer = function integer (errorMessage) {
    return this.rule(function (value) { return value.toString().indexOf('.') === -1; }, errorMessage || '应为整数')
  };

  NumberType.prototype.range = function range (min, max, errorMessage) {
    return this.rule(function (value) { return value >= min && value <= max; }, errorMessage || ("应在 " + min + " 到 " + max + " 之间"))
  };

  NumberType.prototype.min = function min (min$1, errorMessage) {
    return this.rule(function (value) { return value >= min$1; }, errorMessage || ("应不小于 " + min$1))
  };

  NumberType.prototype.max = function max (max$1, errorMessage) {
    return this.rule(function (value) { return value <= max$1; }, errorMessage || ("应不大于 " + max$1))
  };

  NumberType.prototype.oneOf = function oneOf (list, errorMessage) {
    return this.rule(function (value) { return list.indexOf(value) !== -1; }, errorMessage || '非指定值')
  };

  return NumberType;
}(Type_1));

var NumberType_1 = function (errorMessage) { return new NumberType(errorMessage); };

var BooleanType = /*@__PURE__*/(function (Type) {
  function BooleanType(desc) {
    Type.call(this, 'boolean', desc);
    this.rule(function (v) { return typeof v === 'boolean'; }, '应为布尔值');
  }

  if ( Type ) BooleanType.__proto__ = Type;
  BooleanType.prototype = Object.create( Type && Type.prototype );
  BooleanType.prototype.constructor = BooleanType;

  return BooleanType;
}(Type_1));

var BooleanType_1 = function (errorMessage) { return new BooleanType(errorMessage); };

var DateType = /*@__PURE__*/(function (Type) {
  function DateType(desc) {
    Type.call(this, 'date', desc);
    this.rule(function (value) { return !/Invalid|NaN/.test(new Date(value)); }, '应为日期');
  }

  if ( Type ) DateType.__proto__ = Type;
  DateType.prototype = Object.create( Type && Type.prototype );
  DateType.prototype.constructor = DateType;

  DateType.prototype.range = function range (min, max, errorMessage) {
    return this.rule(
      function (value) { return new Date(value) >= new Date(min) && new Date(value) <= new Date(max); },
      errorMessage || ("应在 " + (min.toString()) + " 到 " + (max.toString()) + " 之间")
    )
  };

  DateType.prototype.min = function min (min$1, errorMessage) {
    return this.rule(function (value) { return new Date(value) >= new Date(min$1); }, errorMessage || ("应不小于 " + (min$1.toString())))
  };

  DateType.prototype.max = function max (max$1, errorMessage) {
    return this.rule(function (value) { return new Date(value) <= new Date(max$1); }, errorMessage || ("应不大于 " + (max$1.toString())))
  };

  DateType.prototype.strict = function strict (errorMessage) {
    return this.rule(function (value) { return Object.prototype.toString.call(value) === '[object Date]'; }, errorMessage || '应为日期类型')
  };

  return DateType;
}(Type_1));

var DateType_1 = function (errorMessage) { return new DateType(errorMessage); };

var ObjectType = /*@__PURE__*/(function (Type) {
  function ObjectType(desc) {
    Type.call(this, 'object', desc);
    this.rule(function (v) { return typeof v === 'object'; }, '应为对象');
  }

  if ( Type ) ObjectType.__proto__ = Type;
  ObjectType.prototype = Object.create( Type && Type.prototype );
  ObjectType.prototype.constructor = ObjectType;

  /**
   * @example
   * ObjectType('这是一个对象').shape({
   *  name: StringType(),
   *  age: NumberType()
   * })
   */
  ObjectType.prototype.shape = function shape (types) {
    return this.rule(function (values) {
      var valids = Object.entries(types).map(function (item) {
        var key = item[0];
        var type = item[1];
        return type.check(values[key], values)
      });

      var errors = valids.filter(function (item) { return item.hasError; }) || [];

      if (errors.length) {
        return errors[0];
      }

      return errors.length === 0
    }, null)
  };

  return ObjectType;
}(Type_1));

var ObjectType_1 = function (errorMessage) { return new ObjectType(errorMessage); };

var ArrayType = /*@__PURE__*/(function (Type) {
  function ArrayType(desc) {
    Type.call(this, 'array', desc);
    this.rule(function (v) { return Array.isArray(v); }, '应为数组');
  }

  if ( Type ) ArrayType.__proto__ = Type;
  ArrayType.prototype = Object.create( Type && Type.prototype );
  ArrayType.prototype.constructor = ArrayType;

  ArrayType.prototype.range = function range (min, max, errorMessage) {
    return this.rule(
      function (value) { return value.length >= min && value.length <= max; },
      errorMessage || ("长度应在 " + min + " 到 " + max + " 之间")
    )
  };

  ArrayType.prototype.minlen = function minlen (min, errorMessage) {
    return this.rule(function (value) { return value.length >= min; }, errorMessage || ("长度不小于 " + min))
  };

  ArrayType.prototype.maxlen = function maxlen (max, errorMessage) {
    return this.rule(function (value) { return value.length <= max; }, errorMessage || ("长度不大于 " + max))
  };

  ArrayType.prototype.length = function length (len, errorMessage) {
    return this.rule(function (value) { return value.length === len; }, errorMessage || ("长度应为 " + len))
  };

  ArrayType.prototype.unique = function unique (errorMessage) {
    return this.rule(function (items) {
      var hash = {};
      for (var i$1 = 0, list = items; i$1 < list.length; i$1 += 1) {
        var i = list[i$1];

        if (hash[i]) {
          return false
        }
        hash[i] = true;
      }
      return true
    }, errorMessage || '不能重复')
  };

  ArrayType.prototype.uniqueKey = function uniqueKey (key, errorMessage) {
    return this.rule(function (items) {
      var hash = {};
      for (var i = 0, list = items; i < list.length; i += 1) {
        var item = list[i];

        var v = item[key];
        if (hash[v]) {
          return false
        }
        hash[v] = true;
      }
      return true
    }, errorMessage || '不能重复')
  };

  /**
   * @example
   * ArrayType('这是一个数组').of(
   *   StringType().isOneOf(['数码','体育','游戏','旅途','其他']
   * )
   */
  ArrayType.prototype.of = function of (type) {
    return this.rule(function (items, data) {
      for (var i = 0, list = items; i < list.length; i += 1) {
        var item = list[i];

        var result = type.check(item, data);
        if (result.hasError) { return result }
      }
      return true
    })
  };

  return ArrayType;
}(Type_1));

var ArrayType_1 = function (errorMessage) { return new ArrayType(errorMessage); };

var AnyType = /*@__PURE__*/(function (Type) {
  function AnyType() {
    var types = [], len = arguments.length;
    while ( len-- ) types[ len ] = arguments[ len ];

    Type.call(this, 'any');
    this.rule(function (value, data) {
      var result;
      for (var i = 0, list = types; i < list.length; i += 1) {
        var type = list[i];

        result = type.check(value, data);
        if (!result.hasError) { return result }
      }
      return result
    }, null);
  }

  if ( Type ) AnyType.__proto__ = Type;
  AnyType.prototype = Object.create( Type && Type.prototype );
  AnyType.prototype.constructor = AnyType;

  return AnyType;
}(Type_1));

var AnyType_1 = function () {
  var types = [], len = arguments.length;
  while ( len-- ) types[ len ] = arguments[ len ];

  return new (Function.prototype.bind.apply( AnyType, [ null ].concat( types) ));
};

var Schema$1 = Schema_1.Schema;
var SchemaModel$1 = Schema_1.SchemaModel;

var Schema_1$1 = Schema$1;
var SchemaModel_1$1 = SchemaModel$1;

var T = {
  string: StringType_1,
  number: NumberType_1,
  boolean: BooleanType_1,
  date: DateType_1,
  object: ObjectType_1,
  array: ArrayType_1,
  any: AnyType_1
};

var lib = {
	Schema: Schema_1$1,
	SchemaModel: SchemaModel_1$1,
	T: T
};

exports.Schema = Schema_1$1;
exports.SchemaModel = SchemaModel_1$1;
exports.T = T;
exports.default = lib;
