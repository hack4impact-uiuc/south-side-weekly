import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { IPitchAggregate } from 'ssw-common';

import { getAggregatedPitch, isError } from '../../api';
import { BackButton, ReviewClaimForm } from '../../components';
import ApproveClaimCard from '../../components/ApproveClaimCard';
import { useTeams } from '../../contexts';
import { emptyAggregatePitch } from '../../utils/constants';
import { assignmentStatusEnum } from '../../utils/enums';

import './styles.scss';
import { ParamTypes, TeamContributorRecord } from './types';

//interface ReviewClaimProps {}

const ReviewClaim = (): ReactElement => {
  const { pitchId } = useParams<ParamTypes>();
  const [pendingContributors, setPendingContributors] = useState<
    IPitchAggregate['aggregated']['pendingContributors']
  >([]);
  const [assignmentContributors, setAssignmentContributors] = useState<
    IPitchAggregate['aggregated']['assignmentContributors']
  >([]);
  const [pitchTeams, setPitchTeams] = useState<
    IPitchAggregate['aggregated']['teams']
  >([]);
  const [statusIsCompleted, setStatusIsCompleted] = useState<boolean>(false);

  const [aggregatedPitch, setAggregatedPitch] =
    useState<IPitchAggregate>(emptyAggregatePitch);

  const { teams } = useTeams();

  const fetchAggregatedPitch = useCallback(async (): Promise<void> => {
    const res = await getAggregatedPitch(pitchId);

    if (!isError(res)) {
      const { result } = res.data;
      const { author } = result.aggregated;

      console.log(result);
      setPendingContributors(result.aggregated.pendingContributors);
      setPitchTeams(result.aggregated.teams);
      setAssignmentContributors(result.aggregated.assignmentContributors);
      console.log('aggregated', result.aggregated.assignmentContributors);
      setAggregatedPitch(result);
      setStatusIsCompleted(
        result.assignmentStatus === assignmentStatusEnum.COMPLETED,
      );
    }
  }, [pitchId]);

  useEffect(() => {
    fetchAggregatedPitch();
  }, [pitchId, fetchAggregatedPitch]);

  const allContributors = useMemo(() => {
    console.log(pendingContributors);
    const allContributorsRecord: TeamContributorRecord = {};
    teams.map((team) => {
      allContributorsRecord[team._id] = { pending: [], assignment: [] };
    });

    pendingContributors.map((pendingContributor) => {
      pendingContributor.teams.map((team) => {
        allContributorsRecord[team].pending.push(pendingContributor.user);
      });
    });

    assignmentContributors.map((assignmentContributor) => {
      assignmentContributor.teams.map((team) => {
        allContributorsRecord[team].assignment.push(assignmentContributor.user);
      });
    });

    console.log('ORIGINAL: ', assignmentContributors);

    return allContributorsRecord;
  }, [pendingContributors, assignmentContributors, teams]);

  console.log('ALL', allContributors);

  return (
    <div className="review-claim-page">
      <BackButton title="Back to Unclaimed Pitches" linkTo="/pitches" />

      <div className="content">
        <ReviewClaimForm
          aggregatedPitch={aggregatedPitch}
          callback={fetchAggregatedPitch}
        />

        <div className="card-content">
          {Object.entries(allContributors).map(
            ([teamId, { pending, assignment }], idx) => {
              console.log(teamId, pending, assignment);
              console.log('ASIGNMENT: ', assignment);
              return (
                <ApproveClaimCard
                  key={idx}
                  teamId={teamId}
                  pendingContributors={pending}
                  assignmentContributors={assignment}
                  pitchTeams={pitchTeams}
                  pitchId={pitchId}
                  callback={fetchAggregatedPitch}
                  completed={statusIsCompleted}
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
