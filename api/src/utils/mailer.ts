import nodemailer from 'nodemailer';
import { IUser, IPitch } from 'ssw-common';
import { pitchStatusEnum } from './enums';

type message = { to: string; from: string; subject: string; html: string };

export const approvedMessage = (
  author: IUser,
  pitch: IPitch,
  approver: IUser,
): message => {
  const m = {
    to: author.email,
    from: process.env.EMAIL_USERNAME,
    subject: `Pitch "${pitch.title}" ${pitchStatusEnum.APPROVED}`,
    html: `<div>
                <dt>Hi ${author.firstName},</dt>
                <br>
                <dt>Congratulations, your pitch <a href='"${
                  pitch.assignmentGoogleDocLink
                }"'>"${
      pitch.title
    }"</a> has been approved! Here are the details you provided regarding the pitch:</dt>
                <b>Description:</b> ${pitch.description}
                <br>
                <b>Link:</b> ${pitch.assignmentGoogleDocLink}
                <br>
                <br>
                <dt>Your pitch is due on ${
                  pitch.deadline ? pitch.deadline.toDateString() : 'no date'
                }. 
                If you have any questions or need any additional support, please contact ${
                  approver.email
                }. 
                We can't wait to see your story come together!</dt>
                <br>
                <dt>Thank you,
                    <br>
                ${approver.firstName} ${approver.lastName}
                </dt>
                </div>`,
  };
  return m;
};

export const sendMail = async (message: message): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // send mail with defined transport object
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
