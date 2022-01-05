import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import {
  FullPopulatedPitch,
  Team,
  PendingContributor,
  UserFields,
} from 'ssw-common';
import { apiCall, isError } from '../api';
import ApproveClaimCard from '../components/card/ApproveClaimCard';
import EditingClaimCard from '../components/card/EditingClaimCard';
import { ReviewClaimForm } from '../components/form/ReviewClaimForm';
import { useTeams } from '../contexts';
import { assignmentStatusEnum } from '../utils/enums';

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

type AllContributorsForTeam = {
  pending: UserFields[];
  assignment: UserFields[];
};

type TeamContributorRecord = Record<string, AllContributorsForTeam>;

export type EditorRecord = Record<string, UserWithEditorType>;

type UserWithEditorType = UserFields & { editorType: string };

const Pitch = (): ReactElement => {
  const { pitchId } = useParams<ParamTypes>();
  const [pendingContributors, setPendingContributors] = useState<
    PendingContributor[]
  >([]);
  const [assignmentContributors, setAssignmentContributors] = useState<
    FullPopulatedPitch['assignmentContributors']
  >([]);
  const [pitchTeams, setPitchTeams] = useState<FullPopulatedPitch['teams']>([]);
  const [statusIsCompleted, setStatusIsCompleted] = useState<boolean>(false);
  const [editorContributors, setEditorContributors] = useState<EditorRecord>(
    {},
  );
  const [pendingEditors, setPendingEditors] = useState<EditorRecord>({});
  const [writer, setWriter] = useState<UserFields[]>([]);

  const { teams, getTeamFromId } = useTeams();

  const [pitch, setPitch] = useState<FullPopulatedPitch | null>(null);

  /* useEffect(() => {
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
  }, [pitchId]); */

  const fetchAggregatedPitch = useCallback(async (): Promise<void> => {
    const res = await apiCall<FullPopulatedPitch>({
      method: 'GET',
      url: `/pitches/${pitchId}`,
      populate: 'full',
    });

    if (!isError(res)) {
      const { result } = res.data;
      setPitch(result);

      setPendingContributors(result.pendingContributors);
      setAssignmentContributors(result.assignmentContributors);
      setWriter(result.writer ? [result.writer] : []);
      setPitchTeams(result.teams);
      setStatusIsCompleted(
        result.assignmentStatus === assignmentStatusEnum.COMPLETED,
      );

      const editors: EditorRecord = {};

      if (result.primaryEditor) {
        editors[result.primaryEditor._id] = {
          ...result.primaryEditor,
          editorType: 'First',
        };
      }
      result.secondEditors.map(
        (user) => (editors[user?._id] = { ...user, editorType: 'Seconds' }),
      );
      result.thirdEditors.map(
        (user) => (editors[user?._id] = { ...user, editorType: 'Thirds' }),
      );

      setEditorContributors(editors);
    }

    /* if (!isError(res)) {
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
    } */
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

    const pendingEditorContributors: EditorRecord = {};

    pendingContributors.map((pendingContributor) => {
      pendingContributor.teams.map((team) => {
        if (team.name === 'Editing') {
          pendingEditorContributors[pendingContributor.userId._id] = {
            ...pendingContributor.userId,
            editorType: 'None',
          };
        }
        allContributorsRecord[team._id].pending.push(pendingContributor.userId);
      });
    });

    setPendingEditors(pendingEditorContributors);

    assignmentContributors.map((assignmentContributor) => {
      assignmentContributor.teams.map((team) => {
        allContributorsRecord[team._id].assignment.push(
          assignmentContributor.userId,
        );
      });
    });

    console.log('ORIGINAL: ', assignmentContributors);

    return allContributorsRecord;
  }, [pendingContributors, assignmentContributors, teams]);

  console.log('ALL', allContributors);

  const getTeamWithTargetFromId = (
    teamId: string,
  ): Team & { target: number } => {
    const team = pitchTeams.find(({ teamId: { _id } }) => _id === teamId);
    if (!team) {
      return { ...getTeamFromId(teamId)!, target: 0 };
    }
    return { ...team.teamId, target: team.target };
  };

  return (
    <div className="review-claim-page">
      {/* <BackButton title="Back to Unclaimed Pitches" linkTo="/pitches" /> */}

      <div className="content">
        <ReviewClaimForm
          /* aggregatedPitch={aggregatedPitch}
            callback={fetchAggregatedPitch} */
          pitch={pitch}
        />

        <div className="card-content">
          {Object.entries(allContributors).map(
            ([teamId, { pending, assignment }], idx) => {
              console.log(teamId, pending, assignment);
              console.log('ASIGNMENT: ', assignment);

              if (getTeamFromId(teamId)?.name === 'Editing') {
                return (
                  <EditingClaimCard
                    editors={editorContributors}
                    pitchId={pitchId}
                    completed={false}
                    callback={fetchAggregatedPitch}
                    team={getTeamWithTargetFromId(teamId)}
                    pendingEditors={pendingEditors}
                  />
                );
              }
              return (
                <ApproveClaimCard
                  key={idx}
                  pendingContributors={pending}
                  assignmentContributors={
                    getTeamFromId(teamId)?.name === 'Writing'
                      ? writer
                      : assignment
                  }
                  team={getTeamWithTargetFromId(teamId)}
                  pitchId={pitchId}
                  callback={fetchAggregatedPitch}
                  completed={false}
                />
              );
            },
          )}
        </div>
      </div>

      <pre>{JSON.stringify(pitch, null, 2)}</pre>
    </div>
  );
};

export default Pitch;
