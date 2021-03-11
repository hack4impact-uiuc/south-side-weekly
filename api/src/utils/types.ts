import mongoose, { Document } from 'mongoose';
import { IUser as IUserBase, IPitch as IPitchBase } from 'ssw-common';

/**
 * Interface for a User Schema.
 */
export interface IUser extends Document<any>, IUserBase {}

/**
 * Interface for a Pitch Schema.
 */
export interface IPitch extends Document<any>, IPitchBase {
  pitchAuthor: mongoose.Types.ObjectId;
}
