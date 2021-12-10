import { SendMailOptions } from 'nodemailer';
import { IPitch, IUser } from 'ssw-common';
import { getUserFulName } from '../utils/helpers';

import transporter from './transporter';
import { buildSendMailOptions } from './utils';

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
  pitch: Pick<IPitch, 'title' | 'primaryEditor'>,
  staff: IUser,
): void => {
  const templateValues = {
    contributor: getUserFulName(contributor),
    title: pitch.title,
    primaryEditor: pitch.primaryEditor, // TODO: use populate better
    staff: getUserFulName(staff),
  };

  const mailOptions = buildSendMailOptions(
    contributor.email,
    `Claim Request for "${pitch.title}" approved`,
    'claimRequestApproved.html',
    templateValues,
  );

  sendMail(mailOptions);
};
