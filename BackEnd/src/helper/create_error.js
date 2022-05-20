const http_status = require("../helper/http_status_code")

class newError {
  constructor(
    statusCode = http_status.INTERNAL_SERVICE_ERROR,
    msg = "Internal service error"
  ) {
    this.statusCode = statusCode
    this.msg = msg
  }
}

module.exports = newError