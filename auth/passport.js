const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const UserService = require('../service.js')

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'decode',
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        // Find the user specified in token
        const user = await UserService.read({ _id: payload.sub })

        // If user doesn't exists, handle it
        if (!user) {
          return done(null, false)
        }

        // Otherwise, return the user
        req.user = user
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)
