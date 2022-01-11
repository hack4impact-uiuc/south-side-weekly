import Issue, { IssueSchema } from '../models/issue.model';
import { PopulateType, populateTypes } from './types';
import { getPopulateOptions } from './utils';

export const populateIssue = async (
  issue: PopulateType<IssueSchema>,
  type: populateTypes,
): Promise<PopulateType<IssueSchema>> => {
  if (type === 'none') {
    return issue;
  }

  const baseOptions = [
    { ...getPopulateOptions<IssueSchema>('pitches', 'Pitch') },
  ];

  return await Issue.populate(issue, baseOptions);
};
