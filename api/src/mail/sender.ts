import { SendMailOptions } from 'nodemailer';
import { BasePopulatedPitch, Pitch, Team, User } from 'ssw-common';
import { UserFields } from 'ssw-common/interfaces/_types';
import { getUserFulName } from '../utils/helpers';

import transporter from './transporter';
import { buildContributorHtml, buildSendMailOptions } from './utils';

export const sendMail = async (mailOptions: SendMailOptions): Promise<void> => {
  console.log('REACHED SEND MAIL');
  const mailDelivered = new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      err ? reject(err) : resolve(info);
    });
  });

  await mailDelivered;
  console.log('RESOLVED');
};

export const sendRejectUserMail = (contributor: User, reviewer: User): void => {
  const templateValues = {
    contributor: contributor.fullname,
    role: contributor.role,
    reviewer: reviewer.fullname,
    contact: 'South Side Weekly',
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    'South Side Weekly Contributor Dashboard Access Update',
    'userRejected.html',
    templateValues,
  );

  sendMail(mailOptions);
};

export const sendApproveUserMail = async (
  contributor: User,
  reviewer: User,
): Promise<void> => {
  console.log('REACHED SENDER FUNCTION');
  const templateValues = {
    contributor: getUserFulName(contributor),
    role: contributor.role,
    loginUrl: 'https://hub.southsideweekly.com/login',
    reviewer: getUserFulName(reviewer),
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    'Welcome to the South Side Weekly Contributor Dashboard!',
    'userApproved.html',
    templateValues,
  );

  await sendMail(mailOptions);
};

export const sendClaimRequestApprovedMail = (
  contributor: User,
  pitch: BasePopulatedPitch,
  staff: User,
  team: Team,
): void => {
  const templateValues = {
    contributor: contributor.fullname,
    title: pitch.title,
    primaryEditor: pitch.primaryEditor.fullname,
    staff: staff.fullname,
    contributorsList: buildContributorHtml(pitch),
    teamName: team.name,
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    `Claim Request for "${pitch.title}" approved`,
    'claimRequestApproved.html',
    templateValues,
    {
      cc: pitch.primaryEditor.email,
    },
  );

  sendMail(mailOptions);
};

export const sendApprovedPitchMail = (
  contributor: UserFields,
  reviewer: UserFields,
  pitch: BasePopulatedPitch,
  hasWriter: boolean,
): void => {
  const templateValues = {
    contributor: contributor.fullname,
    pitch: pitch.title,
    pitchDocLink: `https://hub.southsideweekly.com/pitches`,
    staff: reviewer.fullname,
    primaryEditor: pitch.primaryEditor.fullname,
    description: pitch.description,
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    `Pitch "${pitch.title}" approved`,
    hasWriter ? 'pitchApprovedWriter.html' : 'pitchApprovedNoWriter.html',
    templateValues,
    {
      cc: pitch.primaryEditor.email,
    },
  );

  sendMail(mailOptions);
};

export const sendDeclinedPitchMail = (
  contributor: UserFields,
  staff: User,
  pitch: BasePopulatedPitch,
  reasoning?: string,
): void => {
  const templateValues = {
    contributor: contributor.fullname,
    title: pitch.title,
    pitchDocLink: `https://hub.southsideweekly.com/pitches`,
    staff: staff.fullname,
    reasoning: reasoning ? reasoning : '',
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    `Pitch "${pitch.title}" declined`,
    'pitchDeclined.html',
    templateValues,
  );

  sendMail(mailOptions);
};

export const sendContributorAddedToPitchMail = (
  contributor: UserFields,
  staff: UserFields,
  pitch: BasePopulatedPitch,
): void => {
  const templateValues = {
    contributor: contributor.fullname,
    primaryEditor: pitch.primaryEditor.fullname,
    contributorsList: buildContributorHtml(pitch),
    title: pitch.title,
    staff: staff.fullname,
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    `You've been added to "${pitch.title}" Story`,
    'contributorAddedToPitch.html',
    templateValues,
    {
      cc: pitch.primaryEditor.email,
    },
  );

  sendMail(mailOptions);
};

export const sendClaimRequestDeclinedMail = (
  contributor: User,
  staff: User,
  pitch: Pitch,
): void => {
  const templateValues = {
    staff: getUserFulName(staff),
    contributor: getUserFulName(contributor),
    title: pitch.title,
    contact: staff.email,
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    `Story Claim Request for “${pitch.title} Declined`,
    'claimRequestDeclined.html',
    templateValues,
  );

  sendMail(mailOptions);
};
