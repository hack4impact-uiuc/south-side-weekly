import { InterestFields, PitchFields, TeamFields } from "./_types";

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
  }
  
  type BaseUserOmitFields = 'teams' | 'interests';
  
  export interface BasePopulatedUser extends Omit<User, BaseUserOmitFields> {
    teams: TeamFields;
    interests: InterestFields;
  }

  type FullUserOmitFields = 
    BaseUserOmitFields 
        | 'claimedPitches' 
        | 'submittedPitches' 
        | 'submittedClaims';

  export interface FullPopulatedUser extends Omit<User,FullUserOmitFields> {
    teams: TeamFields;
    interests: InterestFields;
    claimedPitches: PitchFields;
    submittedPitches: PitchFields;
    submittedClaims: PitchFields;
  }
  