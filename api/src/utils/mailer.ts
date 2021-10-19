import nodemailer from 'nodemailer';
import { IUser, IPitch, IPitchAggregate } from 'ssw-common';
import { pitchStatusEnum } from './enums';
import User from '../models/user';

interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  html: string
}
type userInfo = { name: string; email: string };
type teamsUsers = Record<string, userInfo[]>;

const getAllTeams = (teamNamesToUsers: teamsUsers): string => {
  const message: string[] = [];
  for (const key in teamNamesToUsers) {
    message.push(`<b>${key}</b> <br>`);
    for (const member of teamNamesToUsers[key]) {
      message.push(`<li> ${member.name} - ${member.email} </li>`);
    }
  }
  return message.join('');
};

export const declinedMessage = (
  author: IUser,
  pitch: IPitch,
  admin: IUser,
): EmailMessage => ({
  //TODO: find out what those links should point to
  to: author.email,
  from: process.env.EMAIL_USERNAME,
  subject: `Pitch "${pitch.title}" ${pitchStatusEnum.REJECTED}`,
  html: `<div>
                <dt>Hi ${author.preferredName || author.firstName},</dt>
                <br>
                <dt>Thank you for submitting your pitch <a href='"${
                  pitch.assignmentGoogleDocLink
                }"'>"${
    pitch.title
  }"</a> Unfortunately, your pitch was declined. </dt>
                If you have any questions or need any additional support, please contact ${
                  admin.email
                }. 
                Check out more <a href='www.google.com'>pitch-writing resources</a>. In the meantime, feel free to check the 
                  <a href='http://south-side-weekly.vercel.app/pitches'>pitch doc</a> for potential new stories to claim!</dt>
                <br>
                <dt>Thank you,
                    <br>
                ${admin.preferredName || admin.firstName}
                </dt>
                </div>`,
});

export const approvedMessage = (
  author: IUser,
  pitch: IPitch,
  admin: IUser,
): EmailMessage => ({
  to: author.email,
  from: process.env.EMAIL_USERNAME,
  subject: `Pitch "${pitch.title}" ${pitchStatusEnum.APPROVED}`,
  html: `<div>
                <dt>Hi ${author.preferredName || author.firstName},</dt>
                <br>
                <dt>Congratulations, your pitch <a href='"${
                  pitch.assignmentGoogleDocLink
                }"'>"${
    pitch.title
  }"</a> has been approved! Here are the details you provided regarding the pitch:</dt>
                <br>
                <b>Description:</b> ${pitch.description}
                <br>
                <b>Link:</b> ${pitch.assignmentGoogleDocLink}
                <br>
                <br>
                <dt>Your pitch is due on ${
                  pitch.deadline ? pitch.deadline.toDateString() : 'no date'
                }. 
                If you have any questions or need any additional support, please contact ${
                  admin.email
                }. 
                We can't wait to see your story come together!</dt>
                <br>
                <dt>Thank you,
                    <br>
                ${admin.preferredName || admin.firstName}
                </dt>
                </div>`,
});

export const approveClaim = async (
  author: IUser,
  pitch: IPitchAggregate,
  admin: Partial<IUser>,
  teams: [string],
): Promise<EmailMessage> => {
  const teamNamesToUsers: teamsUsers = {};
  for (const user of pitch.assignmentContributors) {
    //TODO: for some reason the userId and _id are not exactly strings
    if (String(user.userId) === String(author._id)) {
      //This skips the current user(author) when constructing the teamNamesToUsers
      continue;
    }
    for (const teamName of user.teams) {
      const userModel = await User.findById(user.userId);
      const info: userInfo = {
        name: `${userModel.firstName} ${userModel.lastName}`,
        email: userModel.email,
      };
      if (!(teamName in teamNamesToUsers)) {
        teamNamesToUsers[teamName] = [info];
      } else {
        teamNamesToUsers[teamName].push(info);
      }
    }
  }

  const m = {
    to: author.email,
    from: process.env.EMAIL_USERNAME,
    subject: `Claim Request for "${pitch.title}" ${pitchStatusEnum.APPROVED}`,
    html: `<html>
      Hi ${author.preferredName || author.firstName},
      <br>
      Congratulations, your request to join the ${
        pitch.title
      } as a ${teams.join(' and ')} has been approved!
      <br>
      Here are the other current contributors for this story:
      <br>
      <ul>
      ${getAllTeams(teamNamesToUsers)}
      </ul>
      If you have any questions or need any additional support, please contact ${
        admin.email
      }. We can’t wait to see what you all come up with!
      <br>
      Thank you,
      <br>
      ${admin.preferredName || admin.firstName}
      </html>`,
  };
  return m;
};

export const declineClaim = (
  author: IUser,
  pitch: IPitchAggregate,
  admin: Partial<IUser>,
): EmailMessage => ({
  to: author.email,
  from: process.env.EMAIL_USERNAME,
  subject: `Story Claim Request for ${pitch.title}" ${pitchStatusEnum.REJECTED}`,
  html: `Hi ${author.preferredName || author.firstName},
    <br>
    Thank you for submitting your pitch claim request to join the ${
      pitch.title
    } pitch. 
    Unfortunately, your request was declined for the following reason.
    <br>
    Reasoning message #TODO: Where do we get this from?
    <br>
    If you have any questions or need any additional support, please contact ${
      admin.email
    }. 
    In the meantime, feel free to check the <a href='http://south-side-weekly.vercel.app/pitches}'>pitch doc</a>for potential new stories to claim!
    <br>
    Thank you,
    <br>
    ${admin.preferredName || admin.firstName}`,
});

export const sendMail = async (message: EmailMessage): Promise<void> => {
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
