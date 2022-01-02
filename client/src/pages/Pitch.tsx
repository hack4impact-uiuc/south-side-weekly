import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import { FullPopulatedPitch, IPitchAggregate, ITeam } from 'ssw-common';
import { apiCall, isError } from '../api';
import { ReviewClaimForm } from '../components/form/ReviewClaimForm';
import { useTeams } from '../contexts';

/*  import { getAggregatedPitch, isError } from '../../api';
  import {
    BackButton,
    EditingClaimCard,
    ReviewClaimForm,
  } from '../../components';
  import ApproveClaimCard from '../../components/ApproveClaimCard';
  import { useTeams } from '../../contexts';
  import { emptyAggregatePitch } from '../../utils/constants';
  import { assignmentStatusEnum } from '../../utils/enums'; */

import './Pitch.scss';
//import { EditorRecord, ParamTypes, TeamContributorRecord } from './types';

interface ParamTypes {
  pitchId: string;
}

const Pitch = (): ReactElement => {
  const { pitchId } = useParams<ParamTypes>();
  /* const [pendingContributors, setPendingContributors] = useState<
    IPitchAggregate['aggregated']['pendingContributors']
  >([]);
  const [assignmentContributors, setAssignmentContributors] = useState<
    IPitchAggregate['aggregated']['assignmentContributors']
  >([]);
  const [pitchTeams, setPitchTeams] = useState<
    IPitchAggregate['aggregated']['teams']
  >([]);
  const [statusIsCompleted, setStatusIsCompleted] = useState<boolean>(false);
  const [editorContributors, setEditorContributors] = useState<EditorRecord>(
    {},
  );

  const [aggregatedPitch, setAggregatedPitch] =
    useState<IPitchAggregate>(emptyAggregatePitch); */

  const { teams, getTeamFromId } = useTeams();

  const [pitch, setPitch] = useState<FullPopulatedPitch | null>(null);

  useEffect(() => {
    const loadPitch = async (): Promise<void> => {
      const res = await apiCall<FullPopulatedPitch>({
        method: 'GET',
        url: `/pitches/${pitchId}`,
        populate: 'full',
      });

      if (!isError(res)) {
        setPitch(res.data.result);
      }
    };

    loadPitch();
  }, [pitchId]);

  /*  const fetchAggregatedPitch = useCallback(async (): Promise<void> => {
      const res = await getAggregatedPitch(pitchId);
  
      if (!isError(res)) {
        const { result } = res.data;
  
        console.log(result);
        setPendingContributors(result.aggregated.pendingContributors);
        setPitchTeams(result.aggregated.teams);
        setAssignmentContributors(result.aggregated.assignmentContributors);
        console.log('aggregated', result.aggregated.assignmentContributors);
  
        const editors: EditorRecord = {};
  
        if (result.aggregated.primaryEditor) {
          editors[result.aggregated.primaryEditor._id!] = {
            ...result.aggregated.primaryEditor,
            editorType: 'First',
          };
        }
        result.aggregated.secondaryEditors.map(
          (user) => (editors[user._id!] = { ...user, editorType: 'Seconds' }),
        );
        result.aggregated.thirdEditors.map(
          (user) => (editors[user._id!] = { ...user, editorType: 'Thirds' }),
        );
  
        setEditorContributors(editors);
  
        setAggregatedPitch(result);
        setStatusIsCompleted(
          result.assignmentStatus === assignmentStatusEnum.COMPLETED,
        );
      }
    }, [pitchId]);
  
    useEffect(() => {
      fetchAggregatedPitch();
    }, [pitchId, fetchAggregatedPitch]);
   */
  /* const allContributors = useMemo(() => {
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
  
    console.log('ALL', allContributors); */

  /* const getTeamWithTargetFromId = (
      teamId: string,
    ): ITeam & { target: number } => {
      let team = pitchTeams.find(({ _id }) => _id === teamId);
      if (!team) {
        team = { ...getTeamFromId(teamId)!, target: 0 };
        return team;
      }
      return team;
    }; */

  return (
    <div className="review-claim-page">
      {/* <BackButton title="Back to Unclaimed Pitches" linkTo="/pitches" /> */}

      <div className="content">
        <ReviewClaimForm
          /* aggregatedPitch={aggregatedPitch}
            callback={fetchAggregatedPitch} */
          pitch={pitch}
        />

        {/* <div className="card-content">
            {Object.entries(allContributors).map(
              ([teamId, { pending, assignment }], idx) => {
                console.log(teamId, pending, assignment);
                console.log('ASIGNMENT: ', assignment);
  
                if (getTeamFromId(teamId)?.name === 'Editing') {
                  return (
                    <EditingClaimCard
                      editors={editorContributors}
                      pitchId={pitchId}
                      completed={statusIsCompleted}
                      callback={fetchAggregatedPitch}
                      team={getTeamWithTargetFromId(teamId)}
                    />
                  );
                }
                return (
                  <ApproveClaimCard
                    key={idx}
                    pendingContributors={pending}
                    assignmentContributors={assignment}
                    team={getTeamWithTargetFromId(teamId)}
                    pitchId={pitchId}
                    callback={fetchAggregatedPitch}
                    completed={statusIsCompleted}
                  />
                );
              },
            )}
          </div> */}
      </div>

      <pre>{JSON.stringify(pitch, null, 2)}</pre>
    </div>
  );
};

export default Pitch;
