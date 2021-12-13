import { PitchFields, UserFields } from "./_types";

export interface UserFeedback {
    _id: string;
    staffId: string;
    userId: string;
    pitchId: string;
    stars: number;
    reasoning: string;
    createdAt: Date;
    updatedAt: Date;
}

type BaseUserFeedbackOmitFields = 'staffId' | 'userId' | 'pitchId';

export interface PopulatedUserFeedback extends Omit<UserFeedback, BaseUserFeedbackOmitFields> {
    pitchId: PitchFields;
    staffId: UserFields;
    userId: UserFields;
}