import mongoose, { Document, Schema } from 'mongoose';

import { IPitch } from './pitch';

/**
 * Interface for a User Schema.
 */
interface IUser extends Document<any> {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  oauthID: string;
  gender: [string];
  pronouns: [string];
  dateJoined: Date;
  masthead: boolean;
  onboarding: string;
  portfolio: string;
  linkedIn: string;
  twitter: string;
  claimedPitches: [IPitch];
  submittedPitches: [IPitch];
  currentTeams: [string];
  role: string;
  races: [string];
  interests: [string];
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
  NONE: 'NONE',
};

const rolesEnum = {
  CONTRIBUTOR: 'CONTRIBUTOR',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
  TBD: 'TBD',
};

const racesEnum = {
  AMERICAN_INDIAN_OR_ALASKAN_NATIVE: 'AMERICAN INDIAN OR ALASKAN NATIVE',
  BLACK_OR_AFRICAN_AMERICAN: 'BLACK OR AFRICAN AMERICAN',
  MIDDLE_EASTERN_OR_NORTH_AFRICAN: 'MIDDLE EASTERN OR NORTH AFRICAN',
  NATIVE_HAWAIIAN_OR_PACIFIC_ISLANDER: 'NATIVE HAWAIIAN OR PACIFIC ISLANDER',
  LATINX_OR_HISPANIC: 'LATINX OR HISPANIC',
  WHITE: 'WHITE',
  ASIAN: 'ASIAN',
  OTHER: 'OTHER',
  NONE: 'NONE',
};

const onboardingStatusEnum = {
  ONBOARDING_SCHEDULED: 'ONBOARDING_SCHEDULED',
  STALLED: 'STALLED',
  ONBOARDED: 'ONBOARDED',
};

/**
 * Mongoose Schema to represent a User at South Side Weekly.
 */
const User = new mongoose.Schema({
  firstName: { type: String, default: null, required: true },
  lastName: { type: String, default: null, required: true },
  preferredName: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  oauthID: { type: String, default: null, unique: true, sparse: true },
  genders: [{ type: String, default: null }],
  pronouns: [{ type: String, default: null }],
  dateJoined: { type: Date, default: Date.now },
  masthead: { type: Boolean, default: false },
  onboardingStatus: {
    type: String,
    enum: Object.values(onboardingStatusEnum),
    default: onboardingStatusEnum.ONBOARDING_SCHEDULED,
  },

  portfolio: { type: String, default: null },
  linkedIn: { type: String, default: null },
  twitter: { type: String, default: null },
  claimedPitches: [{ type: Schema.Types.ObjectId, ref: 'Pitch' }],
  submittedPitches: [{ type: Schema.Types.ObjectId, ref: 'Pitch' }],
  currentTeams: [{ type: String, default: null }],

  role: {
    type: String,
    enum: Object.values(rolesEnum),
    default: rolesEnum.TBD,
  },

  races: [
    {
      type: String,
      enum: Object.values(racesEnum),
      default: racesEnum.NONE,
    },
  ],

  interests: [
    {
      type: String,
      enum: Object.values(interestsEnum),
      default: interestsEnum.NONE,
    },
  ],
});

export default mongoose.model<IUser>('User', User);
export { IUser };
export { interestsEnum, rolesEnum, racesEnum };
