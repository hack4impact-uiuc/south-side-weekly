import mongoose, { Document, Schema } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
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
const User = new mongoose.Schema(
  {
    firstName: { type: String, default: null, required: true },
    lastName: { type: String, default: null, required: true },
    preferredName: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    oauthID: { type: String, default: null, unique: true, sparse: true },
    genders: [{ type: String, default: null }],
    pronouns: [{ type: String, default: null }],
    dateJoined: { type: Date, default: Date.now },
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
    submittedClaims: [{ type: Schema.Types.ObjectId, ref: 'Pitch' }],
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    involvementResponse: { type: String, default: null },
    journalismResponse: { type: String, default: null },
    neighborhood: { type: String, required: true },
    onboardReasoning: { type: String, default: null },
    feedback: [{ type: Schema.Types.ObjectId, ref: 'UserFeedback' }],
    lastActive: { type: Date, default: Date.now },

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

    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

User.virtual('fullname').get(function () {
  if (this.preferredName) {
    return `${this.preferredName} ${this.lastName}`;
  }

  return `${this.firstName} ${this.lastName}`;
});

User.virtual('joinedNames').get(function () {
  const preferredName = this.preferredName ? ` (${this.preferredName}) ` : ' ';

  return `${this.firstName}${preferredName}${this.lastName}`;
});

User.virtual('activityStatus').get(function () {
  const now = new Date();
  const lastActive = new Date(this.lastActive);

  const MONTHS_IN_YEAR = 12;

  const ACTIVE_PERIOD = 3;
  const RECENTLY_ACTIVE = MONTHS_IN_YEAR;

  let months = (now.getFullYear() - lastActive.getFullYear()) * MONTHS_IN_YEAR;
  months -= lastActive.getMonth();
  months += now.getMonth();
  months = months <= 0 ? 0 : months;

  if (months <= ACTIVE_PERIOD) {
    return 'ACTIVE';
  } else if (months <= RECENTLY_ACTIVE) {
    return 'RECENTLY_ACTIVE';
  }

  return 'INACTIVE';
});

User.plugin(mongooseLeanVirtuals);

export default mongoose.model<UserSchema>('User', User);
