const express = require('express')
const loaders = require('./loaders')
const UserService = require('./service.js')
const JWT = require('jsonwebtoken')
const passport = require('passport')
const cors = require('cors')
require('./auth/passport')

const app = express()
app.use(cors())
const startServer = async () => {
  await loaders(app)
  const passportJWT = passport.authenticate('jwt', { session: false })

  const signToken = (user) => {
    return JWT.sign(
      {
        iss: 'Authentication',
        sub: user._id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
      },
      'decode'
    )
  }

  app.post('/signup', async (req, res) => {
    const user = await UserService.read(req.body)
    console.log('sdfsf', req.body)
    if (user) {
      console.log('CAME HERE')
      res.status(500).send('User already exists!')
      return
    }
    const savedUser = await UserService.save(req.body)
    const token = signToken(savedUser)
    console.log('token', token)
    res.send(token)
  })

  app.get('/login', async (req, res) => {
    const user = await UserService.read(req.body)
    if (!user) {
      res.status(500).send('User doesnt exists!')
    } else {
      const token = signToken(savedUser)
      res.send(token)
    }
  })

  app.get('/verify', passportJWT, async (req, res) => {
    console.log('user', req.user)
    res.send({ verified_user_details: req.user })
  })

  app.listen(5000, () => {
    console.log('Listening on 5000')
  })
}

startServer()
