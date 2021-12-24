import { InterestFields, PitchFields, TeamFields } from "./_types";
import { UserFeedback } from "./userFeedback.interface";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    preferredName: string;
    email: string;
    phone: string;
    oauthID: string;
    genders: string[];
    pronouns: string[];
    dateJoined: Date;
    onboardingStatus: string;
    visitedPages: string[];
    profilePic: string;
    portfolio: string;
    linkedIn: string;
    twitter: string;
    involvementResponse: string;
    journalismResponse: string;
    neighborhood: string;
    claimedPitches: string[];
    submittedPitches: string[];
    submittedClaims: string[];
    teams: string[];
    role: string;
    races: string[];
    interests: string[];
    onboardReasoning: string;
    feedback: string[];
    lastActive: Date;
    fullname: string;
    activityStatus: string;
    joinedNames: string;
    shortName: string;
    rating: number;
  }
  
  type BaseUserOmitFields = 'teams' | 'interests';
  
  export interface BasePopulatedUser extends Omit<User, BaseUserOmitFields> {
    teams: TeamFields[];
    interests: InterestFields[];
  }

  type FullUserOmitFields = 
    BaseUserOmitFields 
        | 'claimedPitches' 
        | 'submittedPitches' 
        | 'submittedClaims'
        | 'feedback';

  export interface FullPopulatedUser extends Omit<User,FullUserOmitFields> {
    teams: TeamFields[];
    interests: InterestFields[];
    claimedPitches: PitchFields[];
    submittedPitches: PitchFields[];
    submittedClaims: PitchFields[];
    feedback: UserFeedback[];
  }
  