import React, { FC, ReactElement, useState, useEffect } from 'react';
import {
  Button,
  Form,
  Modal,
  ModalProps,
  Grid,
  GridColumn,
  Image,
} from 'semantic-ui-react';
import { IPitchAggregate, IUser } from 'ssw-common';

import { FieldTag } from '../..';
import { aggregatePitch, isError } from '../../../api';
import { getUserFullName } from '../../../utils/helpers';

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
  const [teamsToContributors, setTeamsToContributors] = useState<GroupedContributors[]>();
  useEffect(() => {
    const getAggregate = async (): Promise<void> => {
      const res = await aggregatePitch(pitchId);
      if (!isError(res)) {
        const aggregatedPitch = res.data.result;
        console.log(aggregatedPitch);
        const groupedContributors = groupContributorsByTeam(aggregatedPitch.aggregated.assignmentContributors);
        setTeamsToContributors(groupedContributors);
        setAggregate(aggregatedPitch);
      }
    };
    getAggregate();
  }, [pitchId]);

  function groupContributorsByTeam(assignmentContributors : IPitchAggregate['aggregated']['assignmentContributors']): GroupedContributors[] {
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
    const groupedContributors = Array.from(teamsToContributors, ([team, users]) => ({ team, users }))
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
          <FieldTag content="Visual Arts"></FieldTag>
          <div className="team">
            <FieldTag content="Visual Arts"></FieldTag>
          </div>
        </div>
        <p className="description">
          {aggregate?.description}
        </p>
        <Grid columns="2">
          <GridColumn>
            <div className="avatar-name">
              <h4>Pitch Creator </h4>
              <div className="avatar-pic">
                <Image
                  src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                  avatar
                />
              </div>
              <div>
                <p> {getUserFullName(aggregate?.aggregated.author)} </p>
              </div>
            </div>

            <div className="avatar-name">
              <h4>Writer: </h4>
              <div className="avatar-pic">
                <Image
                  src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                  avatar
                />
              </div>
            </div>
          </GridColumn>
          <GridColumn>
            <h4>Primary Editor: </h4>
            <h4>Second Editor: </h4>
            <h4>Third Editor: </h4>
          </GridColumn>
        </Grid>
        <span></span>
        <h4> Contributors Currently On Pitch </h4>
        <Grid>
          {/* {teamsToContributors?.map(team => (
            
          ))} */}
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
