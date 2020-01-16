const Type = require('./Type')

const REG_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // http://emailregex.com/
const REG_IP = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
const REG_URL = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i'
)

class StringType extends Type {
  constructor(desc) {
    super('string', desc)
    this.rule(v => typeof v === 'string', '应为字符串')
  }

  hasLetter(errorMessage) {
    return this.rule(v => /[a-zA-Z]/.test(v), errorMessage || '应包含字母')
  }

  hasUppercaseLetter(errorMessage) {
    return this.rule(v => /[A-Z]/.test(v), errorMessage || '应包含大写字母')
  }

  hasLowercaseLetter(errorMessage) {
    return this.rule(v => /[a-z]/.test(v), errorMessage || '应包含小写字母')
  }

  letterOnly(errorMessage) {
    return this.rule(v => /^[a-zA-Z]+$/.test(v), errorMessage || '只能是字母')
  }

  hasNumber(errorMessage) {
    return this.rule(v => /[0-9]/.test(v), errorMessage || '应包含数字')
  }

  numberOnly(errorMessage) {
    return this.rule(v => /^\d+$/.test(v), errorMessage || '只能是数字')
  }

  oneOf(list, errorMessage) {
    return this.rule(v => list.indexOf(v) !== -1, errorMessage || '非指定值')
  }

  email(errorMessage) {
    return this.rule(v => REG_EMAIL.test(v), errorMessage || '应为 Email')
  }

  ip(errorMessage) {
    return this.rule(v => REG_IP.test(v), errorMessage || '应为 IP 地址')
  }

  url(errorMessage) {
    return this.rule(v => REG_URL.test(v), errorMessage || '应为 URL')
  }

  // 颜色值？例如 #fff #ffffff
  hex(errorMessage) {
    return this.rule(v => /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i.test(v), errorMessage || '应为十六进制颜色')
  }

  pattern(regex, errorMessage) {
    return this.rule(value => regex.test(value), errorMessage || '格式错误')
  }

  range(min, max, errorMessage) {
    return this.rule(
      value => value.length >= min && value.length <= max,
      errorMessage || `长度应在 ${min} 到 ${max} 字符之间`
    )
  }

  minlen(min, errorMessage) {
    return this.rule(value => value.length >= min, errorMessage || `长度不小于 ${min} 字符`)
  }

  maxlen(max, errorMessage) {
    return this.rule(value => value.length <= max, errorMessage || `长度不大于 ${max} 字符`)
  }

  same(field, errorMessage) {
    return this.rule(
      (value, data) => data ? data[field] === value : false,
      errorMessage || `值应与字段 ${field} 一致`
    )
  }
}

module.exports = errorMessage => new StringType(errorMessage)
