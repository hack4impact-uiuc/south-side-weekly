import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { Message } from 'semantic-ui-react';
import {
  FullPopulatedPitch,
  PendingContributor,
  Team,
  UserFields,
} from 'ssw-common';

import { apiCall, isError } from '../api';
import ApproveClaimCard from '../components/card/ApproveClaimCard';
import EditingClaimCard from '../components/card/EditingClaimCard';
import { ReviewClaimForm } from '../components/form/ReviewClaimForm';
import PitchFeedbackModal from '../components/modal/PitchFeedback';
import { useAuth, useTeams } from '../contexts';
import { issueStatusEnum, pitchStatusEnum } from '../utils/enums';
import './Pitch.scss';

interface ParamTypes {
  pitchId: string;
}

type AllContributorsForTeam = {
  pending: { user: UserFields; message: string }[];
  assignment: UserFields[];
};

type TeamContributorRecord = Record<string, AllContributorsForTeam>;

export type EditorRecord = Record<
  string,
  { user: UserFields; editorType: string }
>;
export type PendingEditorRecord = Record<
  string,
  { user: UserFields; editorType: string; message: string }
>;

const Pitch = (): ReactElement => {
  const { user } = useAuth();
  const { pitchId } = useParams<ParamTypes>();
  const [pendingContributors, setPendingContributors] = useState<
    PendingContributor[]
  >([]);
  const [assignmentContributors, setAssignmentContributors] = useState<
    FullPopulatedPitch['assignmentContributors']
  >([]);
  const [pitchTeams, setPitchTeams] = useState<FullPopulatedPitch['teams']>([]);
  const [readyForFeedback, setReadyForFeedback] = useState<boolean>(false);
  const [editorContributors, setEditorContributors] = useState<EditorRecord>(
    {},
  );
  const [pendingEditors, setPendingEditors] = useState<PendingEditorRecord>({});
  const [writer, setWriter] = useState<UserFields[]>([]);
  const [workedOnPitch, setWorkedOnPitch] = useState(false);
  const [notApproved, setNotApproved] = useState(false);

  const { teams, getTeamFromId } = useTeams();

  const [pitch, setPitch] = useState<FullPopulatedPitch | null>(null);

  const fetchAggregatedPitch = useCallback(async (): Promise<void> => {
    const didWorkOnPitch = (pitch: FullPopulatedPitch): void => {
      if (!user?._id) {
        return;
      }
      const userId = user._id;
      if (pitch.writer?._id === userId || pitch.primaryEditor?._id === userId) {
        setWorkedOnPitch(true);
        return;
      }
      if (
        pitch.secondEditors.find(({ _id }) => _id === userId) ||
        pitch.thirdEditors.find(({ _id }) => _id === userId)
      ) {
        setWorkedOnPitch(true);
        return;
      }
      setWorkedOnPitch(
        !!pitch.assignmentContributors.find(
          ({ userId: { _id } }) => _id === userId,
        ),
      );
    };
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
      isReadyForFeedback(result.issueStatuses);
      didWorkOnPitch(result);
      setNotApproved(result.status !== pitchStatusEnum.APPROVED);

      const editors: EditorRecord = {};

      if (result.primaryEditor) {
        editors[result.primaryEditor._id] = {
          user: result.primaryEditor,
          editorType: 'Primary',
        };
      }
      result.secondEditors.map(
        (user) => (editors[user?._id] = { user, editorType: 'Seconds' }),
      );
      result.thirdEditors.map(
        (user) => (editors[user?._id] = { user, editorType: 'Thirds' }),
      );

      setEditorContributors(editors);
    }
  }, [pitchId, user?._id]);

  useEffect(() => {
    fetchAggregatedPitch();
  }, [pitchId, fetchAggregatedPitch]);

  const isReadyForFeedback = (
    issueStatuses: FullPopulatedPitch['issueStatuses'],
  ): void =>
    setReadyForFeedback(
      !!issueStatuses.find(
        ({ issueId, issueStatus }) =>
          new Date(issueId.releaseDate) <= new Date() &&
          issueStatus === issueStatusEnum.READY_TO_PUBLISH,
      ),
    );

  const allContributors = useMemo(() => {
    const allContributorsRecord: TeamContributorRecord = {};
    const orderedTeams = [
      ...teams.filter(
        (team) => team.name === 'Writing' || team.name === 'Editing',
      ),
      ...teams.filter(
        (team) => team.name !== 'Writing' && team.name !== 'Editing',
      ),
    ];

    orderedTeams.map((team) => {
      allContributorsRecord[team._id] = { pending: [], assignment: [] };
    });

    const pendingEditorContributors: PendingEditorRecord = {};

    pendingContributors.map((pendingContributor) => {
      pendingContributor.teams.map((team) => {
        if (team.name === 'Editing') {
          pendingEditorContributors[pendingContributor.userId._id] = {
            user: pendingContributor.userId,
            editorType: 'None',
            message: pendingContributor.message,
          };
          return;
        }
        allContributorsRecord[team._id].pending.push({
          user: pendingContributor.userId,
          message: pendingContributor.message,
        });
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

    return allContributorsRecord;
  }, [pendingContributors, assignmentContributors, teams]);

  const getTeamWithTargetFromId = (
    teamId: string,
  ): Team & { target: number } => {
    const team = pitchTeams.find(({ teamId: { _id } }) => _id === teamId);
    if (!team) {
      return { ...getTeamFromId(teamId)!, target: 0 };
    }
    return { ...team.teamId, target: team.target };
  };

  if (!pitch) {
    return <></>;
  }

  return (
    <div className="review-claim-page">
      {notApproved && (
        <Message visible className="pitch-status-message" warning>
          {pitch.status === pitchStatusEnum.PENDING
            ? 'This pitch is currently under review.'
            : 'This pitch has been declined.'}
        </Message>
      )}
      <div className="content">
        <div className="form-content">
          <ReviewClaimForm
            pitch={pitch}
            callback={fetchAggregatedPitch}
            notApproved={notApproved}
          />
          {readyForFeedback && workedOnPitch && (
            <PitchFeedbackModal pitchId={pitchId} />
          )}
        </div>

        <div className="card-content">
          {Object.entries(allContributors).map(
            ([teamId, { pending, assignment }], idx) => {
              if (getTeamFromId(teamId)?.name === 'Editing') {
                return (
                  <EditingClaimCard
                    editors={editorContributors}
                    pitchId={pitchId}
                    completed={readyForFeedback}
                    callback={fetchAggregatedPitch}
                    team={getTeamWithTargetFromId(teamId)}
                    pendingEditors={pendingEditors}
                    notApproved={notApproved}
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
                  completed={readyForFeedback}
                  notApproved={notApproved}
                />
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};

export default Pitch;
