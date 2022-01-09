import { SendMailOptions } from 'nodemailer';
import { BasePopulatedPitch, Pitch, ITeam, User } from 'ssw-common';
import { UserFields } from 'ssw-common/interfaces/_types';
import { getUserFulName } from '../utils/helpers';

import transporter from './transporter';
import { buildContributorHtml, buildSendMailOptions } from './utils';

export const sendMail = async (mailOptions: SendMailOptions): Promise<void> => {
  const mailDelivered = new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      err ? reject(err) : resolve(info);
    });
  });

  await mailDelivered;
};

export const sendRejectUserMail = (contributor: User, reviewer: User): void => {
  console.log(contributor);
  console.log(reviewer);

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

export const sendApproveUserMail = (
  contributor: User,
  reviewer: User,
): void => {
  const templateValues = {
    contributor: getUserFulName(contributor),
    role: contributor.role,
    loginUrl: 'https://ssw.h4i.app/login',
    reviewer: getUserFulName(reviewer),
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    'Welcome to the South Side Weekly Contributor Dashboard!',
    'userApproved.html',
    templateValues,
  );

  sendMail(mailOptions);
};

export const sendClaimRequestApprovedMail = (
  contributor: User,
  pitch: Pitch,
  staff: User,
): void => {
  const templateValues = {
    contributor: getUserFulName(contributor),
    title: pitch.title,
    primaryEditor: getUserFulName((pitch.primaryEditor as unknown) as User), // TODO: use populate better
    staff: getUserFulName(staff),
    contributorsList: buildContributorHtml(
      (pitch.assignmentContributors as unknown) as {
        userId: User;
        teams: ITeam[];
      }[],
    ),
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    `Claim Request for "${pitch.title}" approved`,
    'claimRequestApproved.html',
    templateValues,
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
    pitchDocLink: `https://ssw.h4i.app/pitches`,
    reviewer: reviewer.fullname,
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    `Pitch "${pitch.title}" approved`,
    hasWriter ? 'pitchApprovedWriter.html' : 'pitchApprovedNoWriter.html',
    templateValues,
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
    pitchDocLink: `https://ssw.h4i.app/pitches`,
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

export const sendClaimRequestDeclinedMail = (
  contributor: User,
  staff: User,
  pitch: Pitch,
): void => {
  const templateValues = {
    staff: getUserFulName(staff),
    contributor: getUserFulName(contributor),
    pitch: pitch.title,
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
