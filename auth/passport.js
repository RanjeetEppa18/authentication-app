const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { ExtractJwt } = require('passport-jwt')
const UserService = require('../userService.js')

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

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

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '226750324950-bsk855tukrfdpdp4h961mo031jj0kvt2.apps.googleusercontent.com',
      clientSecret: 'yqJ6M_wWSWwHS-3FqXyWOeEr',
      callbackURL: 'http://localhost:5000/auth/google-callback',
    },
    async (accessToken, refreshToken, { _json: data }, cb) => {
      console.log('User Profile:', data)
      const user = await UserService.findOrCreate(data)
      return cb(null, user)
    }
  )
)
