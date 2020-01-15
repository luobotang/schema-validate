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

function createValidator(data) {
  return (value, rules) => {
    for (let i = 0; i < rules.length; i += 1) {
      const { onValid, errorMessage } = rules[i]
      const checkResult = onValid(value, data)

      if (checkResult === false) {
        return { hasError: true, errorMessage }
      } else if (typeof checkResult === 'object' && checkResult.hasError) {
        return checkResult
      }
    }

    return null
  }
}

class Type {
  constructor(name) {
    this.name = name
    this._required = false;
    this._requiredMessage = ''
    this._trim = false
    this._rules = []
    this._priorityRules = [] // Priority check rule
  }

  check(value, data) {
    if (this._required && !checkRequired(value, this.trim)) {
      return { hasError: true, errorMessage: this._requiredMessage }
    }

    const validator = createValidator(data)
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

  required(errorMessage, trim = true) {
    this._required = true
    this._trim = trim
    this._requiredMessage = errorMessage
    return this
  }
}

module.exports = Type