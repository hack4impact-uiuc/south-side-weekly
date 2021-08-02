import { IUser } from 'ssw-common';

// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
/**
 * Extends the express req.user to be defined IUser type
 */
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}
