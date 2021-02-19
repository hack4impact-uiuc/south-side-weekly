import mongoose, { Document } from 'mongoose';

import Pitch, { IPitch } from './pitch';

/**
 * Basic interface for a User Schema
 */
export interface IUser extends Document<any> {
  name: string;
  preferredName: string;
  email: string;
  phone: string;
  oauthID: string;
  gender: string;
  pronouns: string;
  dateJoined: Date;
  portfolio: string;
  linkedIn: string;
  twitter: string;
  claimedPitches: [IPitch];
  submittedPitches: [IPitch];
}

const interestsEnum = {
  POLITICS: 'POLITICS',
  EDUCATION: 'EDUCATION',
  HOUSING: 'HOUSING',
  LIT: 'LIT',
  MUSIC: 'MUSIC',
  VISUAL_ARTS: 'VISUAL ARTS',
  STAGE_AND_SCREEN: 'STAGE AND SCREEN',
  FOOD_AND_LAND: 'FOOD AND LAND',
  NATURE: 'NATURE',
  TRANSPORTATION: 'TRANSPORTATION',
  HEALTH: 'HEALTH',
  CANNABIS: 'CANNABIS',
  IMMIGRATION: 'IMMIGRATION',
  FUN: 'FUN',
};

const rolesEnum = {
  CONTRIBUTOR: 'CONTRIBUTOR',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
};

/**
 * Mongoose Schema to represent a User at South Side Weekly
 */
const User = new mongoose.Schema({
  name: { type: String, default: null },
  preferredName: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  oauthID: { type: String, default: null, unique: true, sparse: true },
  gender: { type: String, default: null },
  pronouns: { type: String, default: null },
  dateJoined: { type: Date, default: Date.now },

  portfolio: { type: String, default: null },
  linkedIn: { type: String, default: null },
  twitter: { type: String, default: null },
  claimedPitches: { type: [Pitch], default: [] },
  submittedPitches: { type: [Pitch], default: [] },

  role: {
    type: String,
    enum: Object.values(rolesEnum),
    default: null,
  },

  interests: {
    type: String,
    enum: Object.values(interestsEnum),
    default: null,
  },
});

export default mongoose.model<IUser>('User', User);
