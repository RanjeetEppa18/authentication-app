const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  username: {
    type: String,
    require: false,
  },
  password: {
    type: String,
    require: false,
  },
})

module.exports = mongoose.model('User', UserSchema)
