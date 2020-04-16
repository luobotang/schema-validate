# schema-validate

数据模型声明及校验工具，借鉴了 [rsuite/schema-typed](https://github.com/rsuite/schema-typed) 项目。

## API

### Schema

构造函数：

- ```Schema(schemaDefinition: Object)```

  传入数据结构声明对象，例如：

  ```js
  new Schema({
    name: T.string('姓名').required()
    age: T.string('年龄').range(18, 30)
  })
  ```

方法：

- ```schema.check(data: Object) => Object {String: CheckResult}```

  检查整个对象，返回各个属性的检查结果，例如：

  ```js
  schema.check({ name: 'abc', age: 18 })
  // 返回：
  result = { name: { hasError: false }, age: { hasError: true, errorMessage: 'xxx' } }
  ```

- ```schema.validate(data: Object) => CheckResult```

  检查整个对象，返回第一个检查失败的属性及结果，例如：
  
  ```js
  schema.validate({ name: 'abc', age: 18 })
  // 返回：
  result = { hasError: true, errorMessage: 'xxx', field: 'age' }
  ```

CheckResult 数据结构：
- hasError: Boolean，是否校验失败
- errorMessage: String，错误信息
- field: String，出错字段

### SchemaModel(schemaDefinition: Object) => Schema

用于简化创建 Schema，等同于 ```new Schema(schemaDefinition)```。

### T

用于创建各种类型检查对象，包括：

- ```T.string()```: 用于检查字符串数据，返回 ```StringType```
- ```T.number()```: 用于检查数值数据，返回 ```NumberType```
- ```T.boolean()```: 用于检查布尔型数据，返回 ```BooleanType```
- ```T.date()```: 用于检查日期数据，返回 ```DateType```
- ```T.object()```: 用于检查对象数据，返回 ```ObjectType```
- ```T.array()```: 用于检查数组数据，返回 ```ArrayType```
- ```T.any()```: 检查传入的多个类型，任意类型满足即可，返回 ```AnyType```，例如 ```T.any(T.string(), T.number())```

所有类型对象都继承自 Type 类：

- ```Type(name, desc)```
- ```type.check(value, data)```
- ```type.rule(onValid, errorMessage, priority)```: 添加一条数据校验规则，```onValid``` 为 ```(value, data) => Boolean || CheckResult```
- ```type.required(errorMessage = '不能为空', trim = true)```: 设置当前数据项不能为空，数据校验时进行非空校验
- ```type.desc(desc)```: 设置用于错误信息的数据描述
- ```type.clone()```: 复制得到当前类型对象的副本实例

### StringType

校验方法都返回当前对象，方便链式调用。校验方法的 errorMessage 都有缺省值。

校验方法：
- ```hasLetter(errorMessage)```
- ```hasUppercaseLetter(errorMessage)```
- ```hasLowercaseLetter(errorMessage)```
- ```letterOnly(errorMessage)```
- ```hasNumber(errorMessage)```
- ```numberOnly(errorMessage)```
- ```isInteger(errorMessage)```
- ```isNumber(errorMessage)```
- ```numberOnly(errorMessage)```
- ```isInteger(errorMessage)```
- ```isNumber(errorMessage)```
- ```isFloat(errorMessage)```
- ```isDouble(errorMessage)```
- ```oneOf(list, errorMessage)```
- ```email(errorMessage)```
- ```ip(errorMessage)```
- ```url(errorMessage)```
- ```hex(errorMessage)```
- ```pattern(regex, errorMessage)```: 通过传入的正则表达式对数据进行校验
- ```range(min, max, errorMessage)```
- ```minlen(min, errorMessage)```
- ```maxlen(max, errorMessage)```
- ```length(len, errorMessage)```
- ```same(field, errorMessage)```: 与当前对象中其他字段值进行比对，不一致返回错误

### NumberType

校验方法：

- ```integer(errorMessage)```
- ```range(min, max, errorMessage)```
- ```min(min, errorMessage)```
- ```max(max, errorMessage)```
- ```oneOf(list, errorMessage)```

### DateType

对可以转为合法日期的字符串、数值、日期对象进行校验，如果需要严格约定类型，可以添加 ```date.strict()``` 规则进行约束。

校验方法：

- ```range(min, max, errorMessage)```
- ```min(min, errorMessage)```
- ```max(max, errorMessage)```
- ```strict(errorMessage)```

### ObjectType

声明嵌套对象，使用方式：

```js
SchemaModel({
  name: T.string('姓名').require(),
  address: T.object('地址').required().shape({
    province: T.string('省份').required(),
    city: T.string('城市').required()
  })
})
```

### ArrayType

校验方法：

- ```range(min, max, errorMessage)```
- ```minlen(min, errorMessage)```
- ```maxlen(max, errorMessage)```
- ```length(len, errorMessage)```
- ```unique(errorMessage)```
- ```uniqueKey(key, errorMessage)```
- ```of(type)```

其中 ```of(type)``` 用于对数组元素类型进行校验，例如：

```js
SchemaModel({
  users: T.array('用户列表').of(T.string('用户名'))
})
```
