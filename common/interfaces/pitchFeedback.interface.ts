import { PitchFields } from "./_types";

export interface PitchFeedback {
    pitchId: string;
    firstQuestion: string;
    secondQuestion: string;
    thirdQuestion: string;
    createdAt: Date;
    updatedAt: Date;
}

type BasePitchFeedbackOmitFields = 'pitchId';

export interface PopulatedPitchFeedback extends Omit<PitchFeedback, BasePitchFeedbackOmitFields> {
    pitchId: PitchFields;
}