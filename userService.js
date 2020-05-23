const User = require('./user_model')

const read = async (data, source = 'sigup') => {
  if (source === 'login') {
    if (!data.password) return null
  }
  const user = await User.findOne(data)
  return user
}

const save = async (data, strategy) => {
  if (strategy === 'local') {
    if (!data.password) return null
  }

  const user = new User(data)
  const saved = await user.save()
  return saved
}

const findOrCreate = async ({ email }) => {
  const user = await read({ email })
  console.log('readOrSave() Email:', email)
  if (user) {
    console.log('User Exists', user)
    return user
  }
  console.log('Creating new user')
  const savedUser = await save({ email })
  return savedUser
}

module.exports = { read, save, findOrCreate }
