const bodyParser = require('./body_parser')
const cors = require('./cors')
require('./mongoose')
module.exports = (app) => {
  bodyParser(app)
  cors(app)
}
