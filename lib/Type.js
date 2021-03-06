function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value === ''
}

function checkRequired(value, trim) {
  // String trim
  if (trim && typeof value === 'string') {
    value = value.replace(/(^\s*)|(\s*$)/g, '')
  }

  // Array
  if (Array.isArray(value)) {
    return !!value.length
  }

  return !isEmpty(value)
}

function createValidator(data, desc) {
  return (value, rules) => {
    for (let i = 0; i < rules.length; i += 1) {
      const { onValid, errorMessage } = rules[i]
      const checkResult = onValid(value, data)

      if (checkResult === false) {
        return { hasError: true, errorMessage: desc + errorMessage } // "数据描述" + "规则错误描述"
      } else if (typeof checkResult === 'object' && checkResult.hasError) {
        return checkResult
      }
    }

    return null
  }
}

class Type {
  constructor(name, desc) {
    this.name = name
    this._desc = desc || '' // 数据描述，用于拼接规则 errorMessage 得到最终错误描述
    this._required = false
    this._requiredMessage = ''
    this._trim = false
    this._rules = []
    this._priorityRules = [] // 优先规则
  }

  check(value, data) {
    if (this._required && !checkRequired(value, this.trim)) {
      return { hasError: true, errorMessage: this._desc + this._requiredMessage }
    }

    const validator = createValidator(data, this._desc)
    const checkStatus = validator(value, this._priorityRules)

    if (checkStatus) {
      return checkStatus
    }

    if (!this._required && isEmpty(value)) {
      return { hasError: false }
    }

    return validator(value, this._rules) || { hasError: false }
  }

  rule(onValid, errorMessage, priority) {
    if (priority) {
      this._priorityRules.push({ onValid, errorMessage })
    } else {
      this._rules.push({ onValid, errorMessage })
    }
    return this
  }

  required(errorMessage = '不能为空', trim = true) {
    this._required = true
    this._trim = trim
    this._requiredMessage = errorMessage
    return this
  }

  desc(desc) {
    this._desc = desc || ''
    return this
  }

  /**
   * 复制当前对象，得到新的 Type 实例对象，便于复用已有 Type
   */
  clone() {
    const t = this
    const n = {}
    Object.setPrototypeOf(n, Object.getPrototypeOf(t)) // 配置继承关系
    n.name = t.name
    n._desc = t._desc
    n._required = t._required
    n._requiredMessage = t._requiredMessage
    n._trim = t._trim
    n._rules = t._rules.concat()
    n._priorityRules = t._priorityRules.concat()
    return n
  }
}

module.exports = Type