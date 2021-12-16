import * as handlebars from 'handlebars';
import { SendMailOptions } from 'nodemailer';
import { ITeam, IUser } from 'ssw-common';

import { Template } from './types';
import { getUserFulName } from '../utils/helpers';
import * as htmlTemplates from './templates';

export const getHtmlString = (templateName: Template): string => {
  switch (templateName) {
    case 'claimRequestApproved.html':
      return htmlTemplates.claimReqDeniedHtml;
    case 'claimRequestDeclined.html':
      return htmlTemplates.claimReqDeniedHtml;
    case 'contributorAddedToPitch.html':
      return htmlTemplates.contributorAddedToPitchHtml;
    case 'pitchApprovedNoWriter.html':
      return htmlTemplates.pitchApprovedNoWriterHtml;
    case 'pitchApprovedWriter.html':
      return htmlTemplates.pitchApprovedWriterHtml;
    case 'pitchDeclined.html':
      return htmlTemplates.pitchDeclinedHtml;
    case 'userApproved.html':
      return htmlTemplates.userApprovedHtml;
    case 'userRejected.html':
      return htmlTemplates.userRejectedHtml;
    default:
      return '';
  }
};

export const compileTemplate = (
  templateName: Template,
  replacements: Record<string, unknown>,
): string => {
  const htmlString = getHtmlString(templateName);
  const buildTemplate = handlebars.compile(htmlString);

  return buildTemplate(replacements);
};

export const buildSendMailOptions = (
  to: string,
  subject: string,
  html: Template,
  htmlData: Record<string, unknown>,
): SendMailOptions => ({
  to: to,
  from: process.env.EMAIL_USERNAME,
  subject: subject,
  html: compileTemplate(html, htmlData),
});

interface Contributor {
  userId: IUser;
  teams: ITeam[];
}

interface TeamMembers {
  team: string;
  users: IUser[];
}

export const groupContributors = (
  contributors: Contributor[],
): TeamMembers[] => {
  const teamsToContributors = new Map<string, IUser[]>();

  contributors.forEach((contributor) => {
    contributor.teams.forEach((team) => {
      if (teamsToContributors.has(team.name)) {
        const users = teamsToContributors.get(team.name);
        users.push(contributor.userId);
      } else {
        teamsToContributors.set(team.name, [contributor.userId]);
      }
    });
  });

  const groupedContributors = Array.from(
    teamsToContributors,
    ([team, users]) => ({ team, users }),
  );

  return groupedContributors.sort((a, b) => a.team.localeCompare(b.team));
};

export const buildContributorHtml = (contributors: Contributor[]): string => {
  const groupedContributors = groupContributors(contributors);

  // Build html multilevel list of contributors for each team
  const contributorHtml = groupedContributors
    .map((group) => {
      const teamHtml = group.users
        .map((user) => `<li>${getUserFulName(user)}</li>`)
        .join('');

      return `<li>${group.team}<ul>${teamHtml}</ul></li>`;
    })
    .join('');

  return contributorHtml;
};
