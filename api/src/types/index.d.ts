import { SessionUser } from '../utils/helpers';

declare namespace Express {
  interface Request {
    user: SessionUser;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser;
  }
}
