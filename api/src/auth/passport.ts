import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth2';

import User from '../models/user';

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:9000/api/auth/google/callback',
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback,
    ) {
      User.findOrCreate(
        { googleId: profile.id },
        function (err: any, user: any) {
          return done(err, user);
        },
      );
    },
  ),
);

export default passport;
