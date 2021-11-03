import { IUser, IPitch, IPitchAggregate } from 'ssw-common';
import User from '../models/user';

export interface EmailMessage {
  to: string;
  from: string;
  cc?: string;
  subject: string;
  html: string;
}
type userInfo = { name: string; email: string };
type teamsUsers = Record<string, userInfo[]>;
const getPitchDocLink = (): string => ('https://south-side-weekly-dpoizlx6i-hack4impact1.vercel.app/pitches')
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

export const notifyMessage = (
  recipient: Partial<IUser>,
  pitch: IPitchAggregate,
  ccUser: Partial<IUser>,
  admin: IUser,
): EmailMessage => ({
  to: recipient.email,
  from: process.env.EMAIL_USERNAME,
  cc: ccUser.email,
  subject: `New Role Assigned To "${pitch.title}"`,
  html: `You have just been assigned by ${admin.firstName} to the pitch titled: ${pitch.title} as the writer`,
});
export const declinedMessage = (
  author: IUser,
  pitch: IPitch,
  admin: IUser,
): EmailMessage => ({
  //TODO: find out what those links should point to
  to: author.email,
  from: process.env.EMAIL_USERNAME,
  subject: `Pitch "${pitch.title}" Declined`,
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
                  <a href='${getPitchDocLink()}'>pitch doc</a> for potential new stories to claim!</dt>
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
  ccUser?: Partial<IUser>,
): EmailMessage => ({
  to: author.email,
  from: process.env.EMAIL_USERNAME,
  cc: ccUser.email,
  subject: `Pitch "${pitch.title}" Approved`,
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
                <br>
                <dt>
                  Your pitch has been added to the <a href="${getPitchDocLink()}">Pitch Doc</a>
                ${ccUser && 
                `
                  Your primary editor, ${ccUser.firstName}, is cc’ed on this email and will be following up to begin discussing your story
                  </dt>
                  <br>
                  <br>
                  <dt>
                  We can't wait to see your story come together!
                `
                }
                </dt>
                <br>
                <br>
                <dt>Thanks for submitting your pitch,
                <br>
                ${admin.preferredName || admin.firstName}
                </dt>
                </div>`,
});

export const approveClaim = async (
  claimUser: IUser,
  pitch: IPitchAggregate,
  admin: IUser,
  teams: [string],
): Promise<EmailMessage> => {
  // if person
  const teamNamesToUsers: teamsUsers = {};
  for (const user of pitch.assignmentContributors) {
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
    to: claimUser.email,
    from: process.env.EMAIL_USERNAME,
    subject: `Claim Request for "${pitch.title}" Approved`,
    html: `<html>
      Hi ${claimUser.preferredName || claimUser.firstName},
      <br>
      Congratulations, your request to join the ${
        pitch.title
      } as a ${teams.join(' and ')} has been approved!
      <br>
      Here are the current contributors for this story:
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
  claimUser: IUser,
  pitch: IPitchAggregate,
  admin: IUser,
): EmailMessage => ({
  to: claimUser.email,
  from: process.env.EMAIL_USERNAME,
  subject: `Story Claim Request for ${pitch.title}" Declined`,
  html: `Hi ${claimUser.preferredName || claimUser.firstName},
    <br>
    <br>
    Thank you for submitting your pitch claim request to join the ${
      pitch.title
    } pitch. 
    Unfortunately, your request was declined for the following reason.
    <br>
    Reasoning message
    <br>
    <br>
    If you have any questions or need any additional support, please contact ${
      admin.email
    }. 
    In the meantime, feel free to check the <a href='http://south-side-weekly.vercel.app/pitches}'>pitch doc</a> for potential new stories to claim!
    <br>
    <br>
    Thank you,
    <br>
    ${admin.preferredName || admin.firstName}`,
});
