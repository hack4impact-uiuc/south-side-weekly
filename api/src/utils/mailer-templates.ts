import { IUser, ITeam, IPitchAggregate } from 'ssw-common';
import Team from '../models/team';

export interface EmailMessage {
  to: string;
  from: string;
  cc?: string;
  subject: string;
  html: string;
}

const buildEmailQuery = (to: string, subject: string, html: string): EmailMessage => ({
    to: to,
    from: process.env.EMAIL_USERNAME,
    subject: subject,
    html: html
  });

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
  admin: Partial<IUser>,
): EmailMessage => {
  const ccUser = pitch.aggregated.primaryEditor;
  const basicEmail = buildEmailQuery(recipient.email, 
    `New Role Assigned To "${pitch.title}"`, 
    `You have just been assigned by ${admin.firstName} to the pitch titled: ${pitch.title} as the writer`)
  return { ...basicEmail, cc: ccUser ? ccUser.email : ''};
};
export const declinedMessage = (
  author: Partial<IUser>,
  pitch: IPitchAggregate,
  admin: IUser,
): EmailMessage => {
  const basicEmail = buildEmailQuery(author.email, 
    `Pitch "${pitch.title}" Declined`,
    `<div>
                <p>Hi ${author.preferredName || author.firstName},</p>
                <br>
                <p>Thank you for submitting your pitch <a href='"${
                  pitch.assignmentGoogleDocLink
                }"'>"${
    pitch.title
  }"</a> Unfortunately, your pitch was declined. </p>
    If you have any questions or need any additional support, please contact ${
      admin.email
    }. 
    Check out more <a href='www.google.com'>pitch-writing resources</a>. In the meantime, feel free to check the 
      <a href='${getPitchDocLink()}'>pitch doc</a> for potential new stories to claim!</p>
    <br>
    <p>Thank you,
        <br>
    ${admin.preferredName || admin.firstName}
    </p>
    </div>`)
  return basicEmail;
};

export const approvedMessage = (
  author: Partial<IUser>,
  pitch: IPitchAggregate,
  admin: Partial<IUser>,
): EmailMessage => {
  const ccUser = pitch.writer ? pitch.aggregated.primaryEditor : undefined
  const basicEmail = buildEmailQuery(author.email,
    `Pitch "${pitch.title}" Approved`, 
    `<div>
                <p>Hi ${author.preferredName || author.firstName},</p>
                <p>Congratulations, your pitch <a href='"${
                  pitch.assignmentGoogleDocLink
                }"'>"${
    pitch.title
  }"</a> has been approved! Here are the details you provided regarding the pitch:</p>
                <br>
                <b>Description:</b> <p>${pitch.description}</p>
                <br>
                <br>
                <p>
                  Your pitch has been added to the <a href="${getPitchDocLink()}">Pitch Doc</a>
                ${ccUser ? 
                `
                  Your primary editor, ${ccUser.firstName}, is cc’ed on this email and will be following up to begin discussing your story
                  </p>
                  <p>
                  We can't wait to see your story come together!
                ` : ``
                }
                </p>
                <p>Thanks for submitting your pitch,
                <br>
                ${admin.preferredName || admin.firstName}
                </p>
                </div>`)
  return {...basicEmail, cc: ccUser ? ccUser.email : ''};
};

export const approveClaim = async (
  claimUser: Partial<IUser>,
  pitch: IPitchAggregate,
  admin: IUser,
): Promise<EmailMessage> => {
  type idToTeam = Record<string, Partial<ITeam>>;

  const teamNamesToUsers: teamsUsers = {};
  const teamIdToTeam:idToTeam = {}
  const claimUserTeams = []

  for (const contributor of pitch.aggregated.assignmentContributors) {
    const info: userInfo = {
      name: `${contributor.user.firstName} ${contributor.user.lastName}`,
      email: contributor.user.email,
    };
    for (const teamId of contributor.teams) {
      const team = teamId in teamIdToTeam ? teamIdToTeam[teamId] : await Team.findById(teamId)
      if (!(teamId in teamIdToTeam)) {
        teamIdToTeam[teamId] = team;
      }
      if (contributor.user._id === claimUser._id) {
        claimUserTeams.push(team.name);
      }
      if (!(team.name in teamNamesToUsers)) {
        teamNamesToUsers[team.name] = [info];
      } else {
        teamNamesToUsers[team.name].push(info);
      }
    }
  }
  const basicEmail = buildEmailQuery(claimUser.email,
    `Claim Request for "${pitch.title}" Approved`,
    `<html>
      Hi ${claimUser.preferredName || claimUser.firstName},
      <br>
      Congratulations, your request to join the ${
        pitch.title
      } on team ${claimUserTeams.join(' and ')} has been approved!
      <br>
      <br>
      Here are the current contributors for this story:
      <br>
      <ul>
      ${getAllTeams(teamNamesToUsers)}
      </ul>
      <br>
      If you have any questions or need any additional support, 
      please contact your primary editor, ${pitch.aggregated.primaryEditor.preferredName || pitch.aggregated.primaryEditor.firstName} ${pitch.aggregated.primaryEditor.lastName}, 
      who is cc’ed on this email. We can’t wait to see what you all come up with!
      <br>
      <br>
      Thank you,
      <br>
      ${admin.preferredName || admin.firstName} ${admin.lastName}
      </html>`)
  return {...basicEmail, cc: pitch.aggregated.primaryEditor.email};
};

export const declineClaim = (
  claimUser: Partial<IUser>,
  pitch: IPitchAggregate,
  admin: Partial<IUser>,
): EmailMessage => {
  const basicEmail = buildEmailQuery(claimUser.email, 
    `Story Claim Request for ${pitch.title}" Declined`,
    `Hi ${claimUser.preferredName || claimUser.firstName},
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
    ${admin.preferredName || admin.firstName}` )
  return basicEmail;
};
