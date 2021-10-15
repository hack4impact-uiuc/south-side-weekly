import nodemailer from 'nodemailer';
import User from '../models/user';
import { IUser, IPitch } from 'ssw-common';
import { pitchStatusEnum } from './enums';

type message = { to: string; from: string; subject: string; html: string };
type userInfo = { name: string; email: string}
type teamsUsers = Record<string, userInfo[]>;

const getAllTeams = (teamNamesToUsers : teamsUsers) : string => {
  const message: string[] = []
  for(const key in teamNamesToUsers) {
    message.push(`${key} <br>`)
    for(const member of teamNamesToUsers[key]) {
      message.push(`<li> ${member.name} - ${member.email} </li>`)
    }
  }
  return message.join('')
}

export const declinedMessage = (
  author: IUser,
  pitch: IPitch,
  admin: IUser,
): message => {
  const link1 = 'www.google.com';
  const link2 = 'www.google.com';
  //TODO: find out what those links should point to
  const m = {
    to: author.email,
    from: process.env.EMAIL_USERNAME,
    subject: `Pitch "${pitch.title}" ${pitchStatusEnum.APPROVED}`,
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
                Check out more <a href='${link1}'>pitch-writing resources</a>. In the meantime, feel free to check the 
                  <a href='${link2}'>pitch doc</a> for potential new stories to claim!</dt>
                <br>
                <dt>Thank you,
                    <br>
                ${admin.preferredName || admin.firstName}
                </dt>
                </div>`,
  };
  return m;
};

export const approvedMessage = (
  author: IUser,
  pitch: IPitch,
  admin: IUser,
): message => {
  const m = {
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
  };
  return m;
};

export const approveClaim = (
  author: IUser,
  pitch: IPitch,
  admin: Partial<IUser>,
  teams: [string],
): message => {
  const teamNamesToUsers: teamsUsers = {
    writers: [{name: 'John D', email: 'johnd@gmail.com'}, {name: 'Jane D', email: 'jane@gmail.com'}], 
    editors: [{name: 'John D', email: 'johnd@gmail.com'}, {name: 'Jane D', email: 'jane@gmail.com'}]
  }
  // for (const user of pitch.assignmentContributors) {
  //   for (const teamName of user.teams) {
  //     const userModel = await User.findById(user.userId);
  //     const info: userInfo = { name: `${userModel.firstName} ${userModel.lastName}`, email: userModel.email}
  //     if (!(teamName in teamNamesToUsers)) {
  //       teamNamesToUsers[teamName] = [info]
  //     } else {
  //       teamNamesToUsers[teamName].push(info);
  //     }
  //   }
  // }
  
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
    }
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
