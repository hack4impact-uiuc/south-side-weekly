import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from 'ssw-common';

import {
  onboardingStatusEnum,
  pagesEnum,
  rolesEnum,
  racesEnum,
} from '../utils/enums';

export type UserSchema = IUser & Document<any>;

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
  visitedPages: [{ type: String, enum: Object.values(pagesEnum) }],
  profilePic: { type: String, default: null },
  portfolio: { type: String, default: null },
  linkedIn: { type: String, default: null },
  twitter: { type: String, default: null },
  claimedPitches: [{ type: Schema.Types.ObjectId, ref: 'Pitch' }],
  submittedPitches: [{ type: Schema.Types.ObjectId, ref: 'Pitch' }],
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  involvementResponse: { type: String, default: null },
  rejectReasoning: {type: String, default: null},

  role: {
    type: String,
    enum: Object.values(rolesEnum),
    default: rolesEnum.TBD,
  },

  hasRoleApproved: { type: Boolean, default: false },

  races: [
    {
      type: String,
      enum: Object.values(racesEnum),
      default: racesEnum.NONE,
    },
  ],

  interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
});

export default mongoose.model<UserSchema>('User', User);
