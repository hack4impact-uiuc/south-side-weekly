import { pick } from 'lodash';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { IPitch, IPitchAggregate, ITeam, IUser } from 'ssw-common';

import { getAggregatedPitch, isError } from '../../api';
import { BackButton, UserChip } from '../../components';
import ApproveClaimCard from '../../components/ApproveClaimCard';

import './styles.scss';
import { ParamTypes, TeamContributorRecord } from './types';

//interface ReviewClaimProps {}

type FormData = Pick<
  IPitch,
  | 'title'
  | 'assignmentGoogleDocLink'
  | 'description'
  | 'topics'
  | 'issues'
  | 'teams'
  | 'primaryEditor'
  | 'secondEditors'
  | 'thirdEditors'
  | 'writer'
>;

const defaultData: FormData = {
  title: '',
  assignmentGoogleDocLink: '',
  description: '',
  topics: [],
  teams: [],
  issues: [],
  writer: '',
  primaryEditor: '',
  secondEditors: [],
  thirdEditors: [],
};

const ReviewClaim = (): ReactElement => {
  const { pitchId } = useParams<ParamTypes>();
  const [author, setAuthor] = useState<Partial<IUser>>({});
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [pendingContributors, setPendingContributors] = useState<
    IPitchAggregate['aggregated']['pendingContributors']
  >([]);
  const [assignmentContributors, setAssignmentContributors] = useState<
    IPitchAggregate['aggregated']['assignmentContributors']
  >([]);
  const [pitchTeams, setPitchTeams] = useState<
    IPitchAggregate['aggregated']['teams']
  >([]);

  console.log(formData);

  useEffect(() => {
    const fetchAggregatedPitch = async (): Promise<void> => {
      const res = await getAggregatedPitch(pitchId);

      if (!isError(res)) {
        const { result } = res.data;
        const { author } = result.aggregated;
        setAuthor(author);

        console.log(result);
        setPendingContributors(result.aggregated.pendingContributors);
        setPitchTeams(result.aggregated.teams);
        setAssignmentContributors(result.aggregated.assignmentContributors);
        setFormData(pick(result, Object.keys(defaultData)) as FormData);
      }
    };
    fetchAggregatedPitch();
  }, [pitchId]);

  const allContributors = useMemo(() => {
    console.log(pendingContributors);
    const allContributorsRecord: TeamContributorRecord = {};

    pendingContributors.map((pendingContributor) => {
      pendingContributor.teams.map((team) => {
        if (allContributorsRecord[team]) {
          allContributorsRecord[team].pending.push(pendingContributor.user);
        } else {
          allContributorsRecord[team] = {
            pending: [pendingContributor.user],
            assignment: [],
          };
        }
      });
    });

    assignmentContributors.map((assignmentContributor) => {
      assignmentContributor.teams.map((team) => {
        if (allContributorsRecord[team]) {
          allContributorsRecord[team].assignment.push(
            assignmentContributor.user,
          );
        } else {
          allContributorsRecord[team] = {
            assignment: [assignmentContributor.user],
            pending: [],
          };
        }
      });
    });

    return allContributorsRecord;
  }, [pendingContributors, assignmentContributors]);

  return (
    <div className="review-claim-page">
      <BackButton title="Back to Unclaimed Pitches" linkTo="/pitches" />

      <div className="content">
        <div className="form-content">
          <div className="form-label-section">
            <span className="form-label row">Pitch Creator:</span>
            <UserChip user={author} />
          </div>

          <div className="form-label-section">
            <span className="form-label">Pitch Title</span>
            <Icon name="pencil" />
          </div>
          <p>{formData.title}</p>

          <div className="form-label-section">
            <span className="form-label">Google Doc Link</span>
            <Icon name="pencil" />
          </div>
          <p>{formData.assignmentGoogleDocLink}</p>

          <div className="form-label-section">
            <span className="form-label">Description</span>
            <Icon name="pencil" />
          </div>
          <p>{formData.description}</p>
          <pre>{JSON.stringify(assignmentContributors, null, 2)}</pre>
          <pre>{JSON.stringify(pendingContributors, null, 2)}</pre>
        </div>

        <div className="card-content">
          {Object.entries(allContributors).map(
            ([teamId, { pending, assignment }], idx) => {
              console.log(teamId, pending, assignment);
              return (
                <ApproveClaimCard
                  key={idx}
                  teamId={teamId}
                  pendingContributors={pending}
                  assignmentContributors={assignment}
                  pitchTeams={pitchTeams}
                />
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewClaim;
