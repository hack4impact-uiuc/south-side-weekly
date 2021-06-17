import mongoose, { Schema } from 'mongoose';

import {
  interestsEnum,
  onboardingStatusEnum,
  rolesEnum,
  racesEnum,
} from '../utils/enums';
import { IUser } from '../types';

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

  profilePic: { type: String, default: null },
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
