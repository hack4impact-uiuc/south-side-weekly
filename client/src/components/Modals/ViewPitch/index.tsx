import React, { FC, ReactElement, useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalProps,
  Grid,
  GridColumn,
  Divider,
} from 'semantic-ui-react';
import { IPitchAggregate, IUser } from 'ssw-common';

import { FieldTag } from '../..';
import { aggregatePitch, isError } from '../../../api';
import { useTeams } from '../../../contexts';
import { emptyAggregatePitch } from '../../../utils/constants';
import RoleRow from '../RoleRow';

import './styles.scss';

interface ViewPitchProps extends ModalProps {
  pitchId: string;
}

interface GroupedContributors {
  team: string;
  users: Partial<IUser>[];
}

const ViewPitchModal: FC<ViewPitchProps> = ({
  pitchId,
  ...rest
}): ReactElement => {
  const { getTeamFromId } = useTeams();

  const [isOpen, setIsOpen] = useState(false);
  const [aggregate, setAggregate] =
    useState<IPitchAggregate>(emptyAggregatePitch);
  const [teamsToContributors, setTeamsToContributors] =
    useState<GroupedContributors[]>();

  useEffect(() => {
    const getAggregate = async (): Promise<void> => {
      const res = await aggregatePitch(pitchId);

      if (!isError(res)) {
        const aggregatedPitch = res.data.result;
        const groupedContributors = groupContributorsByTeam(
          aggregatedPitch.aggregated.assignmentContributors,
        );

        setTeamsToContributors(groupedContributors);
        setAggregate(aggregatedPitch);
      }
    };
    getAggregate();
  }, [pitchId]);

  function groupContributorsByTeam(
    assignmentContributors: IPitchAggregate['aggregated']['assignmentContributors'],
  ): GroupedContributors[] {
    const teamsToContributors = new Map<string, Partial<IUser>[]>();

    assignmentContributors.forEach((contributor) => {
      contributor.teams.forEach((teamName) => {
        if (teamsToContributors.has(teamName)) {
          const users = teamsToContributors.get(teamName);
          users?.push(contributor.user);
        } else {
          teamsToContributors.set(teamName, [contributor.user]);
        }
      });
    });

    const groupedContributors = Array.from(
      teamsToContributors,
      ([team, users]) => ({ team, users }),
    );

    return groupedContributors.sort((a, b) => a.team.localeCompare(b.team));
  }

  return (
    <Modal
      trigger={
        <Button className="default-btn" content="View an Example Pitch" />
      }
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      className="view-pitch"
      {...rest}
    >
      <Modal.Header content="View Pitch" />
      <Modal.Content>
        <h3> Pitch Title: {aggregate?.title} </h3>
        <div className="teams-section">
          {aggregate?.aggregated.interests.map((interest, index) => (
            <FieldTag
              key={index}
              content={interest.name}
              hexcode={interest.color}
            ></FieldTag>
          ))}
        </div>
        <p className="description">{aggregate?.description}</p>
        <Grid columns="2">
          <GridColumn>
            <div>
              <RoleRow
                roleName="Pitch Creator"
                users={[aggregate?.aggregated.author]}
              />
            </div>
            <div>
              <RoleRow
                roleName="Writer"
                users={[aggregate?.aggregated.writer]}
              />
            </div>
          </GridColumn>
          <GridColumn>
            <div>
              <RoleRow
                roleName="Primary Editor"
                users={[aggregate?.aggregated.primaryEditor]}
              />
            </div>
            <div>
              <RoleRow
                roleName="Second Editor"
                users={aggregate?.aggregated.secondaryEditors}
              />
            </div>
            <div>
              <RoleRow
                roleName="Third Editor"
                users={aggregate?.aggregated.thirdEditors}
              />
            </div>
          </GridColumn>
        </Grid>
        <h4> Other Contributors Currently On Pitch </h4>
        <Divider />
        <Grid columns="2">
          <GridColumn>
            {teamsToContributors?.map((team, index) => (
              <RoleRow
                key={index}
                roleName={getTeamFromId(team.team)?.name || ''}
                users={team.users}
              />
            ))}
          </GridColumn>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default ViewPitchModal;
