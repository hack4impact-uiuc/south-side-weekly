import React, { FC, ReactElement, useState, useEffect } from 'react';
import {
  Button,
  Form,
  Modal,
  ModalProps,
  Grid,
  GridColumn,
  GridRow,
} from 'semantic-ui-react';
import { IPitchAggregate, IUser } from 'ssw-common';

import { FieldTag } from '../..';
import { aggregatePitch, isError } from '../../../api';
import NameTag from '../../NameTag';

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
  const [isOpen, setIsOpen] = useState(false);
  const [aggregate, setAggregate] = useState<IPitchAggregate>(); // update to empty Aggregate
  const [teamsToContributors, setTeamsToContributors] =
    useState<GroupedContributors[]>();
  const editors = ['Primary Editor: ', 'Second Editor: ', 'Third Editor: '];
  useEffect(() => {
    const getAggregate = async (): Promise<void> => {
      const res = await aggregatePitch(pitchId);
      if (!isError(res)) {
        const aggregatedPitch = res.data.result;
        console.log(aggregatedPitch);
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
      className="claim-modal"
      {...rest}
    >
      <Modal.Header content="View Pitch" />
      <Modal.Content>
        <h3> Pitch Title: {aggregate?.title} </h3>
        <div className="teams-section">
          {aggregate?.topics.map((topic, index) => (
            <FieldTag key={index} content={topic}></FieldTag>
          ))}
        </div>
        <p className="description">{aggregate?.description}</p>
        <Grid columns="2">
          <GridColumn>
            <GridRow>
              <div className="category-name">
                <h4>Pitch Creator: </h4>
                <div className="move-nametag">
                  <NameTag user={aggregate?.aggregated.author}></NameTag>
                </div>
              </div>
            </GridRow>
            <GridRow>
              <div className="category-name">
                <h4> Writer: </h4>
              </div>
            </GridRow>
          </GridColumn>
          <GridColumn>
            {editors.map((editor, index) => (
              <GridRow key={index}>
                <h4>{editor}</h4>
              </GridRow>
            ))}
          </GridColumn>
        </Grid>

        <span></span>
        <h4> Other Contributors Currently On Pitch </h4>
        <Grid>
          <GridColumn>
            {teamsToContributors?.map((team, index) => (
              <GridRow key={index}>
                <div className="category-name">
                  <h4>{`${team.team}: `} </h4>
                  <div className="move-nametag"></div>
                  {team.users.map((user, index) => (
                    <NameTag key={index} user={user}></NameTag>
                  ))}
                </div>
              </GridRow>
            ))}
          </GridColumn>
        </Grid>
        <Form>
          <Form.Group
            inline
            widths={5}
            className="team-select-group"
          ></Form.Group>
        </Form>
        <div className="contributors-section"></div>
      </Modal.Content>
    </Modal>
  );
};

export default ViewPitchModal;
