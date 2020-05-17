const bodyParser = require('./body_parser')
require('./mongoose')
module.exports = (app) => {
  bodyParser(app)
}
