import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import passport from 'passport';
import User, { IUser } from '../models/user';
import { SessionUser, sessionizeUser } from '../utils/helpers';
import { rolesEnum } from './enums';

passport.serializeUser((user: SessionUser, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: any, user: IUser) => {
    if (err || !user) {
      done(err, false);
      return;
    }
    done(null, sessionizeUser(user));
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback,
    ) => {
      const user = await User.findOne({ oauthID: profile.id });
      if (user) {
        // user already exists
        done(null, user);
      } else {
        // create new user
        const newUser = new User({
          oauthID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          role: rolesEnum.TBD,
        });

        newUser.save();

        done(null, newUser);
      }
    },
  ),
);
