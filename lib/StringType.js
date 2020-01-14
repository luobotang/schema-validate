const Type = require('./Type')

class StringType extends Type {
  constructor(errorMessage = 'Please enter a valid string') {
    super('string');
    this.rule(v => typeof v === 'string', errorMessage)
  }

  hasLetter(errorMessage) {
    return this.rule(v => /[a-zA-Z]/.test(v), errorMessage)
  }

  hasUppercaseLetter(errorMessage) {
    return this.rule(v => /[A-Z]/.test(v), errorMessage)
  }

  hasLowercaseLetter(errorMessage) {
    return this.rule(v => /[a-z]/.test(v), errorMessage)
  }

  letterOnly(errorMessage) {
    return this.rule(v => /^[a-zA-Z]+$/.test(v), errorMessage)
  }

  hasNumber(errorMessage) {
    return this.rule(v => /[0-9]/.test(v), errorMessage)
  }

  oneOf(strArr, errorMessage) {
    return this.rule(v => !!~strArr.indexOf(v), errorMessage)
  }

  email(errorMessage) {
    //http://emailregex.com/
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return this.rule(v => regexp.test(v), errorMessage)
  }

  url(errorMessage) {
    const regexp = new RegExp(
      '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
      'i'
    );
    return this.rule(v => regexp.test(v), errorMessage);
    return this;
  }

  hex(errorMessage) {
    const regexp = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;
    return this.rule(v => regexp.test(v), errorMessage)
  }

  pattern(regexp, errorMessage) {
    return this.rule(value => regexp.test(value), errorMessage)
  }

  range(minLength, maxLength, errorMessage) {
    return this.rule(value => value.length >= minLength && value.length <= maxLength, errorMessage)
  }

  minlen(minLength, errorMessage) {
    return this.rule(value => value.length >= minLength, errorMessage)
  }

  maxlen(maxLength, errorMessage) {
    return this.rule(value => value.length <= maxLength, errorMessage)
  }
}

export default errorMessage => new StringType(errorMessage);
