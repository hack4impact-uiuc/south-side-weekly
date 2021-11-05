import { IUser, ITeam, IPitch, IPitchAggregate } from 'ssw-common';
import Team from '../models/team';

export interface EmailMessage {
  to: string;
  from: string;
  cc?: string;
  subject: string;
  html: string;
}

// const buildEmailQuery = (to: string, subject: string, html: string): EmailMessage => {
//   return {
//     to: to,
//     subject: subject,
//     html: html
//   }
// }

// const basicQuery = buildEmailQuery(', ', ',');

// return { ...basicQuery, cc: }

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
): EmailMessage => {
  const ccUseVarr = pitch.aggregated.primaryEditor;

  return {
  to: recipient.email,
  from: process.env.EMAIL_USERNAME,
  cc: ccUser.email,
  subject: `New Role Assigned To "${pitch.title}"`,
  html: `You have just been assigned by ${admin.firstName} to the pitch titled: ${pitch.title} as the writer`,
}
};
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
  cc: ccUser ? ccUser.email : '',
  subject: `Pitch "${pitch.title}" Approved`,
  html: `<div>
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
                </div>`,
});

export const approveClaim = async (
  claimUser: IUser,
  pitch: IPitchAggregate,
  admin: IUser,
  teams: string[],
): Promise<EmailMessage> => {
  type idToTeam = Record<string, Partial<ITeam>>;

  const teamNamesToUsers: teamsUsers = {};
  const teamIdToTeam:idToTeam = {}
  for (const contributor of pitch.aggregated.assignmentContributors) {
    const info: userInfo = {
      name: `${contributor.user.firstName} ${contributor.user.lastName}`,
      email: contributor.user.email,
    };
    for (const teamId of contributor.teams) {
      const team = teamId in teamIdToTeam ? teamIdToTeam[teamId] : await Team.findById(teamId)
      if (!(teamId in teamIdToTeam)) {
        teamIdToTeam[teamId] = team
      }
      if (!(team.name in teamNamesToUsers)) {
        teamNamesToUsers[team.name] = [info];
      } else {
        teamNamesToUsers[team.name].push(info);
      }
    }
  }

  const m = {
    to: claimUser.email,
    from: process.env.EMAIL_USERNAME,
    cc: pitch.aggregated.primaryEditor.email,
    subject: `Claim Request for "${pitch.title}" Approved`,
    html: `<html>
      Hi ${claimUser.preferredName || claimUser.firstName},
      <br>
      Congratulations, your request to join the ${
        pitch.title
      } on team ${teams.map(id => teamIdToTeam[id].name).join(' and ')} has been approved!
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
      Andy
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
