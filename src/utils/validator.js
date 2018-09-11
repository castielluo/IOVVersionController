var Match = {
  // 校验身份证格式
  matchID: function (value, errMsg) {
    return errMsg
  },
  // 校验是否为空
  matchEmpty: function (value, errMsg) {
    console.log('matchempty')
    if (value === '') {
      return errMsg
    }
  },
  // 校验最小长度
  lengthMin: function (length, value, errMsg) {
    console.log(length, value, errMsg)
    if (value.length < length) {
      return errMsg
    }
  },
  // 上传大小限制
  maxSize: function (value, errMsg) {
    console.log(value, errMsg)
    if (value.size > 2097152) {
      return errMsg
    }
  }
}

var Validator = function () {
  this.cache = []
}

Validator.prototype.add = function (value, rule) {
  // 循环每一个校验值需要校验的几个函数
  for (var i in rule) {
    var arr = rule[i].method.split(':')
    var ruleName = arr.shift()
    arr.push(value)
    arr.push(rule[i].msg)
    // 压栈一个个函数的名称和参数
    this.cache.push({'name': ruleName, 'arg': arr})
  }
}

Validator.prototype.start = function () {
  for (var i in this.cache) {
    var msg = Match[this.cache[i].name].apply(this, this.cache[i].arg)
    if (msg) {
      // 循环执行，如果有报错，停止循环并返回
      return msg
    }
  }
}
export default Validator
