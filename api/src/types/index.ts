import mongoose, { Document } from 'mongoose';
import { SessionUser } from '../utils/helpers';
import { IUser as IUserBase, IPitch as IPitchBase } from 'ssw-common';

/**
 * Interface for a User Schema.
 */
export interface IUser extends Document<any>, IUserBase {}

/**
 * Interface for a Pitch Schema.
 */
export interface IPitch extends Document<any>, IPitchBase {
  _id: string;
  pitchAuthor: mongoose.Types.ObjectId;
}

/**
 * Modules for express-session.
 */
declare module 'Express' {
  interface Request {
    user: SessionUser;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser;
  }
}
