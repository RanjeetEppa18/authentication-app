const User = require('./user_model')

const read = async (data) => {
  const user = await User.findOne(data)
  return user
}

const save = async (data) => {
  const user = new User(data)
  const saved = await user.save()
  return saved
}

module.exports = { read, save }
