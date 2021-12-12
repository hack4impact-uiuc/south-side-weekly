import { SendMailOptions } from 'nodemailer';
import { IPitch, ITeam, IUser } from 'ssw-common';
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

export const sendRejectUserMail = (
  contributor: IUser,
  reviewer: IUser,
): void => {
  const templateValues = {
    contributor: getUserFulName(contributor),
    role: contributor.role,
    reviewer: getUserFulName(reviewer),
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
  contributor: IUser,
  reviewer: IUser,
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
  contributor: IUser,
  pitch: IPitch,
  staff: IUser,
): void => {
  const templateValues = {
    contributor: getUserFulName(contributor),
    title: pitch.title,
    primaryEditor: getUserFulName((pitch.primaryEditor as unknown) as IUser), // TODO: use populate better
    staff: getUserFulName(staff),
    contributorsList: buildContributorHtml(
      (pitch.assignmentContributors as unknown) as {
        userId: IUser;
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
  contributor: IUser,
  reviewer: IUser,
  pitch: IPitch,
  hasWriter: boolean,
): void => {
  const templateValues = {
    contributor: getUserFulName(contributor),
    pitch: pitch.title,
    pitchDocLink: `https://ssw.h4i.app/pitches`,
    reviewer: getUserFulName(reviewer),
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
  contributor: IUser,
  reviewer: IUser,
  pitch: IPitch,
  reasoning?: string,
): void => {
  const templateValues = {
    contributor: getUserFulName(contributor),
    pitch: pitch.title,
    pitchDocLink: `https://ssw.h4i.app/pitches`,
    reviewer: getUserFulName(reviewer),
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
  contributor: IUser,
  staff: IUser,
  pitch: IPitch,
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
