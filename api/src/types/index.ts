import mongoose, { Document } from 'mongoose';
import { SessionUser } from '../utils/helpers';
import { IUser as IUserBase, IPitch as IPitchBase } from 'ssw-common';

/**
 * Interface for a User Schema.
 */
export interface IUser extends Document<any>, IUserBase {
  _id: string;
}

/**
 * Interface for a Pitch Schema.
 */
export interface IPitch extends Document<any>, IPitchBase {
  _id: string;
}

/**
 * Modules for express-session.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Express {
  export interface Request {
    user: SessionUser;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser;
  }
}
