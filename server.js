const express = require('express')
const loaders = require('./loaders')
const UserService = require('./userService.js')
const JWT = require('jsonwebtoken')
const passport = require('passport')
require('./auth/passport')

const app = express()
app.use(passport.initialize())
app.use(passport.session())

const startServer = async () => {
  await loaders(app)
  const passportJWT = passport.authenticate('jwt', { session: false })
  const passportGoogleAuth2 = passport.authenticate('google', {
    scope: ['email', 'profile'],
  })

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
    console.log('Request body:', req.body)
    if (user) {
      res.status(500).send('User already exists!')
      return
    }
    const savedUser = await UserService.save(req.body, 'local')
    if (!savedUser) {
      res
        .status(500)
        .send('Something went wrong!, Try with google authentication')
    }
    const token = signToken(savedUser)
    console.log('token', token)
    res.send(token)
  })

  app.get('/login', async (req, res) => {
    const user = await UserService.read(req.body, 'login')
    if (!user) {
      res
        .status(500)
        .send(`User doesn't exists OR Try with Google authentication`)
    } else {
      const token = signToken(savedUser)
      res.send(token)
    }
  })

  app.get('/auth/google', passportGoogleAuth2)

  app.get(
    '/auth/google-callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      console.log('Authenticated by google successfully!')
      res.redirect('/auth/success')
      // const token = signToken(savedUser)
      // res.send(token)
    }
  )

  app.get('/auth/success', async (req, res) => {
    res.send(
      '<html><body><h1>Authentication successfull ! 🎉</h1></body></html>'
    )
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
