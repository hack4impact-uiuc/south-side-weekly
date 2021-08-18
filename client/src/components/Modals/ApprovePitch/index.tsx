import { isEmpty, toString } from 'lodash';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Grid, Modal, ModalProps } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';
import Swal from 'sweetalert2';

import { approvePitch, declinePitch, getUser, isError } from '../../../api';
import { allTeams } from '../../../utils/constants';
import { classNames, getUserFullName } from '../../../utils/helpers';
import FieldTag from '../../FieldTag';
import PitchCard from '../../PitchCard';

import './styles.scss';

interface ApprovePitchProps extends ModalProps {
  pitch: IPitch;
  callback(): void;
}

const ApprovePitchModal: FC<ApprovePitchProps> = ({
  pitch,
  callback,
  ...rest
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [teamMap, setTeamMap] = useState(new Map<string, number>());

  const getAuthor = useCallback(async (): Promise<void> => {
    if (isEmpty(pitch.author)) {
      return;
    }

    const res = await getUser(pitch.author);

    if (!isError(res)) {
      setAuthor(getUserFullName(res.data.result));
    }
  }, [pitch.author]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const map = new Map<string, number>();

    allTeams.map((team) => {
      map.set(team, 0);
    });

    setTeamMap(new Map(map));

    getAuthor();

    return () => {
      setAuthor('');
      setTeamMap(new Map());
    };
  }, [getAuthor, isOpen]);

  const changeTeam = (team: string, value: number): void => {
    teamMap.set(team, value);
    setTeamMap(new Map(teamMap));
  };

  const parseToTeams = (map: Map<string, number>): IPitch['teams'] => ({
    writers: {
      current: 0,
      target: map.get('WRITING')!,
    },
    editors: {
      current: 0,
      target: map.get('EDITING')!,
    },
    factChecking: {
      current: 0,
      target: map.get('FACT-CHECKING')!,
    },
    photography: {
      current: 0,
      target: map.get('PHOTOGRAPHY')!,
    },
    visuals: {
      current: 0,
      target: map.get('VISUALS')!,
    },
    illustration: {
      current: 0,
      target: map.get('ILLUSTRATION')!,
    },
  });

  const handleApprove = async (): Promise<void> => {
    console.log(parseToTeams(teamMap));
    console.log(teamMap);

    let validForm = false;

    teamMap.forEach((value) => {
      if (value > 0) {
        validForm = true;
      }
    });

    if (!validForm) {
      Swal.fire({
        title: 'Please set at least 1 team position',
        icon: 'error',
      });
    }

    const res = await approvePitch(pitch._id, parseToTeams(teamMap));

    if (!isError(res)) {
      callback();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Successfully approved pitch.',
      });
      setIsOpen(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to approve pitch.',
        text: 'Server may be down.',
      });
    }
  };

  const handleDecline = async (): Promise<void> => {
    const res = await declinePitch(pitch._id);

    if (!isError(res)) {
      callback();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Successfully declined pitch.',
      });
      setIsOpen(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to decline pitch.',
        text: 'Server may be down.',
      });
    }
  };

  return (
    <Modal
      {...rest}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      trigger={<PitchCard pitch={pitch} />}
      className={classNames('approve-pitch-modal', rest.className)}
    >
      <Modal.Header content="Approve or Decline Pitch" />
      <Modal.Content>
        <h1>{pitch.title}</h1>
        <Grid className="topics-section" columns={6}>
          {pitch.topics.map((topic, index) => (
            <Grid.Column key={index}>
              <FieldTag content={topic} />
            </Grid.Column>
          ))}
        </Grid>
        <div className="author-section">
          <div className="author">
            <h3>{`Submitted by: ${author}`}</h3>
          </div>
        </div>
        <p className="description">{pitch.description}</p>
        <p>
          Link to Pitch:{' '}
          <a href={pitch.assignmentGoogleDocLink}>
            {pitch.assignmentGoogleDocLink}
          </a>
        </p>
        <h2>Set positions Available Per Team: </h2>
        <p>
          If approving this Pitch, please indicate the amount of positions that
          each team will have for this Pitch:
        </p>
        <Form>
          <Form.Group inline widths={5} className="team-select-group">
            {allTeams.map((team, index) => (
              <div key={index} className="input-group">
                <FieldTag content={team} />
                <Form.Input
                  onChange={(e, { value }) => changeTeam(team, parseInt(value))}
                  value={toString(teamMap.get(team))}
                  type="number"
                  min={0}
                />
              </div>
            ))}
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleApprove} content="Approve Pitch" positive />
        <Button onClick={handleDecline} content="Decline Pitch" negative />
      </Modal.Actions>
    </Modal>
  );
};

export default ApprovePitchModal;
